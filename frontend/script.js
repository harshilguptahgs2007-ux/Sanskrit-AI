const translateBtn = document.getElementById("translateBtn");
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const sourceLanguage = document.getElementById("sourceLanguage");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");
const charCount = document.getElementById("charCount");

const API_URL = "http://127.0.0.1:8000/translate";

function updateCharacterCount() {
    if (charCount && inputText) {
        charCount.textContent = `${inputText.value.length}/2000`;
    }
}

if (inputText) {
    inputText.addEventListener("input", updateCharacterCount);
}

if (translateBtn) {
    translateBtn.addEventListener("click", async () => {
        const text = inputText ? inputText.value.trim() : "";

        if (!text) {
            outputText.textContent = "Please enter some text to translate.";
            return;
        }

        if (text.length > 2000) {
            outputText.textContent = "Text must be 2000 characters or fewer.";
            return;
        }

        const sourceLang = sourceLanguage ? sourceLanguage.value : "en-IN";

        translateBtn.disabled = true;
        translateBtn.textContent = "Translating...";
        outputText.textContent = "Please wait while your text is being translated...";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: text,
                    source_language_code: sourceLang
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Translation failed. Please try again.");
            }

            outputText.textContent = data.sanskrit_text || "No translation was returned.";

        } catch (error) {
            console.error("Translation error:", error);

            if (error.name === "TypeError" && error.message.includes("fetch")) {
                outputText.textContent = "Unable to connect to the server. Please make sure your FastAPI backend is running on http://127.0.0.1:8000.";
            } else {
                outputText.textContent = error.message || "An unexpected error occurred.";
            }
        } finally {
            translateBtn.disabled = false;
            translateBtn.textContent = "Translate to Sanskrit";
        }
    });
}

if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
        const translatedText = outputText ? outputText.textContent.trim() : "";

        if (!translatedText || translatedText.startsWith("Please") ||
            translatedText.startsWith("Unable") ||
            translatedText.startsWith("Translation failed")) {
            return;
        }

        try {
            await navigator.clipboard.writeText(translatedText);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";

            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1500);
        } catch (error) {
            outputText.textContent = "Unable to copy the text. Please select and copy it manually.";
        }
    });
}

if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
        const translatedText = outputText ? outputText.textContent.trim() : "";

        if (!translatedText || translatedText.startsWith("Please") ||
            translatedText.startsWith("Unable") ||
            translatedText.startsWith("Translation failed")) {
            return;
        }

        const blob = new Blob([translatedText], {
            type: "text/plain;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "sanskrit-translation.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    });
}

if (clearBtn) {
    clearBtn.addEventListener("click", () => {
        if (inputText) {
            inputText.value = "";
        }
        if (outputText) {
            outputText.textContent = "Your Sanskrit translation will appear here...";
        }
        updateCharacterCount();
    });
}

updateCharacterCount();
