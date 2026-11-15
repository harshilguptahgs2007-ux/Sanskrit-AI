import sqlite3
import hashlib
import os
from pathlib import Path
from typing import Optional, Dict, Any

DB_PATH = Path(__file__).resolve().parent / "shlokawise.db"
SALT = "shlokawise_sanskrit_ai_2026"

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    """Hash password with sha256 and salt."""
    return hashlib.sha256((SALT + password).encode("utf-8")).hexdigest()

def init_db() -> None:
    """Initializes the SQLite database schema."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        """)
        conn.commit()

# Initialize DB on module import
init_db()

def create_user(name: str, email: str, password: str) -> Dict[str, Any]:
    """Registers a new user."""
    name = (name or "").strip()
    email = (email or "").strip().lower()
    if not name:
        raise ValueError("Please provide a name.")
    if not email or "@" not in email:
        raise ValueError("Please provide a valid email address.")
    if not password or len(password) < 4:
        raise ValueError("Password must be at least 4 characters.")

    p_hash = hash_password(password)

    with get_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                (name, email, p_hash)
            )
            conn.commit()
            user_id = cursor.lastrowid
            return {
                "id": user_id,
                "name": name,
                "email": email
            }
        except sqlite3.IntegrityError:
            raise ValueError("An account with this email already exists. Please log in.")

def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticates user with email and password."""
    email = (email or "").strip().lower()
    if not email or not password:
        return None

    p_hash = hash_password(password)

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, name, email, password_hash FROM users WHERE email = ?",
            (email,)
        )
        row = cursor.fetchone()
        if not row:
            return None

        if row["password_hash"] == p_hash:
            # Update last_login
            cursor.execute(
                "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
                (row["id"],)
            )
            conn.commit()
            return {
                "id": row["id"],
                "name": row["name"],
                "email": row["email"]
            }
        return None

def get_or_register_user(name: str, email: str, password: str) -> Dict[str, Any]:
    """Logs in if user exists, or registers a new user seamlessly."""
    email = (email or "").strip().lower()
    name = (name or "").strip() or email.split("@")[0].title()
    password = password or "seeker123"

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, password_hash FROM users WHERE email = ?", (email,))
        row = cursor.fetchone()

        if row:
            # Authenticate
            p_hash = hash_password(password)
            if row["password_hash"] == p_hash:
                cursor.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", (row["id"],))
                conn.commit()
                return {"id": row["id"], "name": row["name"], "email": row["email"], "is_new": False}
            else:
                raise ValueError("Incorrect password for this email account.")
        else:
            # Create new user
            return {**create_user(name, email, password), "is_new": True}
