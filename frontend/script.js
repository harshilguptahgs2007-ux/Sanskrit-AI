/**
 * Shlokawise — Sanskrit AI Shloka Translator & Analyzer
 * Frontend Application Logic (Vanilla JavaScript)
 */

(function () {
    "use strict";

    // -------------------------------------------------------------------------
    // 1. Configuration & Authentic Canonical Scripture Verses
    // -------------------------------------------------------------------------
    const isHostedOnBackend = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    const isPort8000 = window.location.port === "8000";

    // Configurable Backend API Endpoint
    const API_ENDPOINT = (isHostedOnBackend && isPort8000)
        ? "/interpret"
        : "http://127.0.0.1:8000/interpret";

    // Authentic Sanskrit verses for the 5 example buttons
    const SCRIPTURE_EXAMPLES = {
        bg247: {
            title: "Bhagavad Gita 2.47",
            text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥"
        },
        gayatri: {
            title: "Gayatri Mantra (Rigveda 3.62.10)",
            text: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं।\nभर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥"
        },
        yogasutras: {
            title: "Patanjali Yoga Sutras 1.2",
            text: "योगश्चित्तवृत्तिनिरोधः॥\nतदा द्रष्टुः स्वरूपेऽवस्थानम्॥"
        },
        shanti: {
            title: "Taittiriya Shanti Mantra",
            text: "ॐ सह नाववतु। सह नौ भुनक्तु।\nसह वीर्यं करवावहै।\nतेजस्वि नावधीतमस्तु मा विद्विषावहै।\nॐ शान्तिः शान्तिः शान्तिः॥"
        },
        ishavasya: {
            title: "Isha Upanishad — Verse 1",
            text: "ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥"
        }
    };

    // Vocabulary quick-load triggers
    const VOCABULARY_SHLOKAS = {
        "धर्म (Dharma)": "धर्मो रक्षति रक्षितः। तस्माद्धर्मो न हन्तव्यो मा नो धर्मो हतोऽवधीत्॥",
        "सत्य (Satya)": "सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः॥",
        "मोक्ष (Moksha)": "यदा सर्वे प्रमुच्यन्ते कामा येऽस्य हृदि श्रिताः। अथ मर्त्योऽमृतो भवत्यत्र ब्रह्म समश्नुते॥",
        "ब्रह्मन् (Brahman)": "सर्वं खल्विदं ब्रह्म तज्जलानिति शान्त उपासीत॥",
        "आत्मन् (Atman)": "अयमात्मा ब्रह्म। प्रज्ञानं ब्रह्म। अहं ब्रह्मास्मि। तत्त्वमसि॥",
        "अहिंसा (Ahimsa)": "अहिंसा परमो धर्मस्तथाहिंसा परं तपः। अहिंसा परमं सत्यं यतो धर्मः प्रवर्तते॥"
    };

    // -------------------------------------------------------------------------
    // 2. DOM Elements
    // -------------------------------------------------------------------------
    const shlokaInput = document.getElementById("shlokaInput");
    const charCounter = document.getElementById("charCounter");
    const validationBanner = document.getElementById("validationBanner");
    const validationText = document.getElementById("validationText");
    const interpretBtn = document.getElementById("interpretBtn");
    const btnLabel = document.getElementById("btnLabel");
    const btnSpinner = document.getElementById("btnSpinner");
    const modeButtons = document.querySelectorAll(".mode-btn");
    const exampleButtons = document.querySelectorAll(".example-btn");

    // Results elements
    const resultsSection = document.getElementById("resultsSection");
    const resultTitle = document.getElementById("resultTitle");
    const resultModeBadge = document.getElementById("resultModeBadge");
    const resultMeter = document.getElementById("resultMeter");
    const resSanskrit = document.getElementById("resSanskrit");
    const resTransliteration = document.getElementById("resTransliteration");
    const resTranslation = document.getElementById("resTranslation");
    const resWordTableBody = document.getElementById("resWordTableBody");
    const resPhilosophical = document.getElementById("resPhilosophical");
    const resContext = document.getElementById("resContext");
    const resTakeaways = document.getElementById("resTakeaways");
    const resReflections = document.getElementById("resReflections");
    const resUniversalTeaching = document.getElementById("resUniversalTeaching");
    const resCrossFaithGrid = document.getElementById("resCrossFaithGrid");

    // Result Cards containers
    const cardTransliteration = document.getElementById("cardTransliteration");
    const cardWordByWord = document.getElementById("cardWordByWord");
    const cardPhilosophical = document.getElementById("cardPhilosophical");
    const cardContext = document.getElementById("cardContext");
    const cardTakeaways = document.getElementById("cardTakeaways");
    const cardReflections = document.getElementById("cardReflections");
    const cardCrossFaith = document.getElementById("cardCrossFaith");

    // Action buttons
    const copyShlokaBtn = document.getElementById("copyShlokaBtn");
    const copyTranslationBtn = document.getElementById("copyTranslationBtn");
    const copyAllBtn = document.getElementById("copyAllBtn");
    const newInterpretBtn = document.getElementById("newInterpretBtn");

    // Error section
    const errorSection = document.getElementById("errorSection");
    const errorTitle = document.getElementById("errorTitle");
    const errorMessage = document.getElementById("errorMessage");
    const errorCloseBtn = document.getElementById("errorCloseBtn");

    // Navigation & Dropdown
    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const toastNotification = document.getElementById("toastNotification");
    const toastMessage = document.getElementById("toastMessage");

    // Daily Shloka elements
    const dailyInterpretBtn = document.getElementById("dailyInterpretBtn");
    const dailySanskritText = document.getElementById("dailySanskritText");

    // State Variables
    let selectedMode = "full";
    let lastInterpretationData = null;
    let isRequestInProgress = false;

    // -------------------------------------------------------------------------
    // 3. UI Helpers: Character Count, Toast, Errors
    // -------------------------------------------------------------------------
    function updateCharacterCount() {
        if (!shlokaInput || !charCounter) return;
        const count = shlokaInput.value.length;
        charCounter.textContent = `${count} / 4000 characters`;
        if (count > 4000) {
            charCounter.style.color = "#dc2626";
        } else {
            charCounter.style.color = "var(--text-light-brown)";
        }
    }

    function showValidation(msg) {
        if (!validationBanner || !validationText) return;
        validationText.textContent = msg;
        validationBanner.hidden = false;
    }

    function hideValidation() {
        if (!validationBanner) return;
        validationBanner.hidden = true;
    }

    function showToast(message) {
        if (!toastNotification || !toastMessage) return;
        toastMessage.textContent = message;
        toastNotification.classList.add("show");
        setTimeout(() => {
            toastNotification.classList.remove("show");
        }, 2200);
    }

    function showError(title, msg) {
        if (!errorSection) return;
        if (errorTitle) errorTitle.textContent = title;
        if (errorMessage) errorMessage.textContent = msg;
        errorSection.hidden = false;
        errorSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function hideError() {
        if (errorSection) {
            errorSection.hidden = true;
        }
    }

    // -------------------------------------------------------------------------
    // 4. Navigation & Profile Dropdown Interactions
    // -------------------------------------------------------------------------
    if (profileBtn && profileMenu) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const container = profileBtn.closest(".profile-dropdown-container");
            const isOpen = container.classList.toggle("open");
            profileBtn.setAttribute("aria-expanded", isOpen);
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            const container = document.querySelector(".profile-dropdown-container");
            if (container && !container.contains(e.target)) {
                container.classList.remove("open");
                if (profileBtn) profileBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Mobile Hamburger Navigation Drawer
    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener("click", () => {
            const isOpen = mobileMenuBtn.classList.toggle("open");
            mobileDrawer.classList.toggle("open", isOpen);
        });

        // Close mobile drawer on link click
        mobileDrawer.querySelectorAll(".mobile-nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenuBtn.classList.remove("open");
                mobileDrawer.classList.remove("open");
            });
        });
    }

    if (errorCloseBtn) {
        errorCloseBtn.addEventListener("click", hideError);
    }

    // Profile menu buttons feedback
    const menuSavedShlokas = document.getElementById("menuSavedShlokas");
    if (menuSavedShlokas) {
        menuSavedShlokas.addEventListener("click", (e) => {
            e.preventDefault();
            showToast("Saved Shlokas collection opened");
        });
    }

    const menuSignOut = document.getElementById("menuSignOut");
    if (menuSignOut) {
        menuSignOut.addEventListener("click", () => {
            showToast("Signed out of Seeker account");
        });
    }

    // -------------------------------------------------------------------------
    // 5. Example Shloka Buttons Interaction
    // -------------------------------------------------------------------------
    exampleButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const verseKey = btn.getAttribute("data-verse");
            const verseData = SCRIPTURE_EXAMPLES[verseKey];

            if (verseData && shlokaInput) {
                // Update active state
                exampleButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                shlokaInput.value = verseData.text;
                updateCharacterCount();
                hideValidation();
                hideError();

                // Smooth focus
                shlokaInput.focus();
                showToast(`Loaded: ${verseData.title}`);
            }
        });
    });

    // Quick-load scripture links in footer
    document.querySelectorAll(".quick-load-link").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const verseKey = link.getAttribute("data-verse");
            const verseData = SCRIPTURE_EXAMPLES[verseKey];
            if (verseData && shlokaInput) {
                shlokaInput.value = verseData.text;
                updateCharacterCount();
                hideValidation();
                hideError();
                document.getElementById("interpret").scrollIntoView({ behavior: "smooth" });
                shlokaInput.focus();
                showToast(`Loaded: ${verseData.title}`);
            }
        });
    });

    // -------------------------------------------------------------------------
    // 6. Mode Selector Buttons Interaction
    // -------------------------------------------------------------------------
    modeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            modeButtons.forEach((b) => {
                b.classList.remove("active");
                b.setAttribute("aria-checked", "false");
            });

            btn.classList.add("active");
            btn.setAttribute("aria-checked", "true");
            selectedMode = btn.getAttribute("data-mode");

            // Feedback toast for mode
            let modeTitle = "Full Interpretation Mode";
            if (selectedMode === "quick") modeTitle = "Quick Summary Mode";
            if (selectedMode === "cross_faith") modeTitle = "Cross-Faith Comparative Mode";
            showToast(`Mode set to: ${modeTitle}`);
        });
    });

    // Textarea input listeners
    if (shlokaInput) {
        shlokaInput.addEventListener("input", () => {
            updateCharacterCount();
            hideValidation();
        });
    }

    // -------------------------------------------------------------------------
    // 7. Interpret Button & Backend API Integration
    // -------------------------------------------------------------------------
    function setLoadingState(loading) {
        isRequestInProgress = loading;
        if (!interpretBtn) return;

        interpretBtn.disabled = loading;
        if (loading) {
            if (btnSpinner) btnSpinner.hidden = false;
            if (btnLabel) btnLabel.textContent = "Interpreting...";
        } else {
            if (btnSpinner) btnSpinner.hidden = true;
            if (btnLabel) btnLabel.textContent = "Interpret ✦";
        }
    }

    async function handleInterpretation() {
        if (isRequestInProgress) return;

        const rawText = shlokaInput ? shlokaInput.value.trim() : "";

        // 1. Validation check
        if (!rawText) {
            showValidation("Please paste or type a Sanskrit shloka to interpret.");
            if (shlokaInput) shlokaInput.focus();
            return;
        }

        if (rawText.length > 4000) {
            showValidation("Shloka text exceeds the maximum 4000 character limit.");
            return;
        }

        hideValidation();
        hideError();
        setLoadingState(true);

        try {
            // Call FastAPI Backend POST /interpret
            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    shloka: rawText,
                    mode: selectedMode
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errMsg = errorData.detail || `Server returned error status ${response.status}.`;
                throw new Error(errMsg);
            }

            const data = await response.json();
            lastInterpretationData = data;

            // Render AI results
            renderResults(data, selectedMode);

            // Scroll smoothly to results
            if (resultsSection) {
                resultsSection.hidden = false;
                resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            showToast("Interpretation rendered successfully ✦");

        } catch (err) {
            console.error("Interpretation request failed:", err);

            // If backend is unavailable or offline
            if (err.name === "TypeError" && err.message.toLowerCase().includes("fetch")) {
                showError(
                    "FastAPI Backend Server is Offline",
                    `Unable to connect to ${API_ENDPOINT}. Please ensure your local FastAPI server is running.`
                );
            } else {
                showError(
                    "Interpretation Error",
                    err.message || "An unexpected error occurred while analyzing the shloka."
                );
            }
        } finally {
            setLoadingState(false);
        }
    }

    if (interpretBtn) {
        interpretBtn.addEventListener("click", handleInterpretation);
    }

    // Ctrl+Enter or Cmd+Enter to interpret quickly
    if (shlokaInput) {
        shlokaInput.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                handleInterpretation();
            }
        });
    }

    // -------------------------------------------------------------------------
    // 8. Results Dynamic Rendering
    // -------------------------------------------------------------------------
    function renderResults(data, mode) {
        if (!resultsSection) return;

        // Title, Mode, Meter
        if (resultTitle) {
            resultTitle.textContent = data.title || "Sanskrit Shloka Interpretation";
        }

        if (resultModeBadge) {
            if (mode === "quick") {
                resultModeBadge.textContent = "✦ QUICK SUMMARY";
            } else if (mode === "cross_faith") {
                resultModeBadge.textContent = "✦ CROSS-FAITH COMPARISON";
            } else {
                resultModeBadge.textContent = "✦ FULL INTERPRETATION";
            }
        }

        if (resultMeter) {
            resultMeter.textContent = `Meter: ${data.meter || "Classical Sanskrit Chhandas"}`;
        }

        // Sanskrit Display
        if (resSanskrit) {
            const rawShloka = data.shloka || (shlokaInput ? shlokaInput.value : "");
            resSanskrit.innerHTML = escapeHtml(rawShloka).replace(/\n/g, "<br>");
        }

        // Transliteration
        if (resTransliteration && cardTransliteration) {
            if (data.transliteration) {
                resTransliteration.innerHTML = escapeHtml(data.transliteration).replace(/\n/g, "<br>");
                cardTransliteration.hidden = false;
            } else {
                cardTransliteration.hidden = true;
            }
        }

        // Translation
        if (resTranslation) {
            resTranslation.textContent = data.translation || "Translation not provided.";
        }

        // Word-by-Word Analysis (Full & Cross-Faith)
        if (cardWordByWord && resWordTableBody) {
            if (mode === "quick" || !data.word_by_word || data.word_by_word.length === 0) {
                cardWordByWord.hidden = true;
            } else {
                cardWordByWord.hidden = false;
                resWordTableBody.innerHTML = "";

                data.word_by_word.forEach((item) => {
                    const tr = document.createElement("tr");

                    const tdWord = document.createElement("td");
                    tdWord.className = "sanskrit-word-cell";
                    tdWord.textContent = item.word || "";

                    const tdTranslit = document.createElement("td");
                    tdTranslit.className = "translit-word-cell";
                    tdTranslit.textContent = item.transliteration || "";

                    const tdGrammar = document.createElement("td");
                    tdGrammar.className = "grammar-word-cell";
                    tdGrammar.textContent = item.grammar || "Padacheda";

                    const tdMeaning = document.createElement("td");
                    tdMeaning.className = "meaning-word-cell";
                    tdMeaning.textContent = item.meaning || "";

                    tr.appendChild(tdWord);
                    tr.appendChild(tdTranslit);
                    tr.appendChild(tdGrammar);
                    tr.appendChild(tdMeaning);

                    resWordTableBody.appendChild(tr);
                });
            }
        }

        // Philosophical Meaning
        if (cardPhilosophical && resPhilosophical) {
            if (mode === "quick" && data.short_meaning) {
                resPhilosophical.textContent = data.short_meaning;
                cardPhilosophical.hidden = false;
            } else if (data.philosophical_meaning) {
                resPhilosophical.textContent = data.philosophical_meaning;
                cardPhilosophical.hidden = false;
            } else {
                cardPhilosophical.hidden = true;
            }
        }

        // Historical & Spiritual Context
        if (cardContext && resContext) {
            if (mode === "quick" || !data.context) {
                cardContext.hidden = true;
            } else {
                resContext.textContent = data.context;
                cardContext.hidden = false;
            }
        }

        // Key Takeaways
        if (cardTakeaways && resTakeaways) {
            const takeaways = data.key_takeaways || [];
            if (takeaways.length === 0) {
                cardTakeaways.hidden = true;
            } else {
                cardTakeaways.hidden = false;
                resTakeaways.innerHTML = "";
                takeaways.forEach((point) => {
                    const li = document.createElement("li");
                    li.className = "takeaway-item";
                    li.innerHTML = `<span class="takeaway-bullet">✦</span> <span>${escapeHtml(point)}</span>`;
                    resTakeaways.appendChild(li);
                });
            }
        }

        // Reflection Questions
        if (cardReflections && resReflections) {
            const reflections = data.reflection_questions || [];
            if (mode === "quick" || reflections.length === 0) {
                cardReflections.hidden = true;
            } else {
                cardReflections.hidden = false;
                resReflections.innerHTML = "";
                reflections.forEach((question, idx) => {
                    const div = document.createElement("div");
                    div.className = "reflection-item";
                    div.innerHTML = `
                        <div class="reflection-index">${idx + 1}</div>
                        <div class="reflection-query">${escapeHtml(question)}</div>
                    `;
                    resReflections.appendChild(div);
                });
            }
        }

        // Cross-Faith Section
        if (cardCrossFaith && resCrossFaithGrid) {
            const crossData = data.cross_faith;
            if (crossData && (mode === "cross_faith" || crossData.comparisons)) {
                cardCrossFaith.hidden = false;

                if (resUniversalTeaching) {
                    resUniversalTeaching.textContent = crossData.universal_teaching || "Universal human truth transcending geographic borders.";
                }

                resCrossFaithGrid.innerHTML = "";
                const comparisons = crossData.comparisons || [];

                comparisons.forEach((item) => {
                    const div = document.createElement("div");
                    div.className = "tradition-item";
                    div.innerHTML = `
                        <div class="tradition-name">${escapeHtml(item.tradition || "Tradition")}</div>
                        <div class="tradition-concept">${escapeHtml(item.quote_or_concept || "")}</div>
                        <div class="tradition-insight">${escapeHtml(item.insight || "")}</div>
                    `;
                    resCrossFaithGrid.appendChild(div);
                });
            } else {
                cardCrossFaith.hidden = true;
            }
        }
    }

    // -------------------------------------------------------------------------
    // 9. Copy to Clipboard Functionality
    // -------------------------------------------------------------------------
    async function copyTextToClipboard(text, successMessage, buttonElement) {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            showToast(successMessage);

            if (buttonElement) {
                const textSpan = buttonElement.querySelector(".copy-text") || buttonElement.querySelector("span:not(.icon)");
                const originalText = textSpan ? textSpan.textContent : buttonElement.textContent;
                if (textSpan) textSpan.textContent = "Copied!";
                setTimeout(() => {
                    if (textSpan) textSpan.textContent = originalText;
                }, 1800);
            }
        } catch (err) {
            console.error("Clipboard copy failed:", err);
            showToast("Failed to copy automatically. Please select text manually.");
        }
    }

    if (copyShlokaBtn) {
        copyShlokaBtn.addEventListener("click", () => {
            const text = resSanskrit ? resSanskrit.innerText.trim() : "";
            copyTextToClipboard(text, "Sanskrit verse copied to clipboard", copyShlokaBtn);
        });
    }

    if (copyTranslationBtn) {
        copyTranslationBtn.addEventListener("click", () => {
            const text = resTranslation ? resTranslation.innerText.trim() : "";
            copyTextToClipboard(text, "English translation copied to clipboard", copyTranslationBtn);
        });
    }

    if (copyAllBtn) {
        copyAllBtn.addEventListener("click", () => {
            if (!lastInterpretationData) {
                showToast("No interpretation data available to copy.");
                return;
            }

            const d = lastInterpretationData;
            let report = `# ${d.title || "Sanskrit Shloka Interpretation"}\n`;
            if (d.meter) report += `Meter: ${d.meter}\n\n`;
            report += `## Sanskrit Shloka\n${d.shloka || ""}\n\n`;
            if (d.transliteration) report += `## IAST Transliteration\n${d.transliteration}\n\n`;
            report += `## Translation\n${d.translation || ""}\n\n`;

            if (d.word_by_word && d.word_by_word.length > 0) {
                report += `## Word-by-Word Breakdown\n`;
                d.word_by_word.forEach((w) => {
                    report += `- ${w.word} (${w.transliteration || ""}): ${w.meaning} [${w.grammar}]\n`;
                });
                report += "\n";
            }

            if (d.philosophical_meaning) report += `## Philosophical Meaning\n${d.philosophical_meaning}\n\n`;
            if (d.context) report += `## Context\n${d.context}\n\n`;

            if (d.key_takeaways && d.key_takeaways.length > 0) {
                report += `## Key Takeaways\n`;
                d.key_takeaways.forEach((t) => (report += `- ${t}\n`));
                report += "\n";
            }

            if (d.cross_faith && d.cross_faith.comparisons) {
                report += `## Universal & Cross-Faith Parallels\n${d.cross_faith.universal_teaching || ""}\n`;
                d.cross_faith.comparisons.forEach((c) => {
                    report += `### ${c.tradition}: ${c.quote_or_concept}\n${c.insight}\n`;
                });
            }

            report += "\n---\nReport generated by Shlokawise (BY SANATANA360)";
            copyTextToClipboard(report, "Full interpretation report copied in Markdown format", copyAllBtn);
        });
    }

    if (newInterpretBtn) {
        newInterpretBtn.addEventListener("click", () => {
            if (shlokaInput) {
                shlokaInput.value = "";
                updateCharacterCount();
                shlokaInput.focus();
            }
            if (resultsSection) {
                resultsSection.hidden = true;
            }
            document.getElementById("interpret").scrollIntoView({ behavior: "smooth" });
        });
    }

    // -------------------------------------------------------------------------
    // 10. Daily Shloka & Learn Glossary Interactions
    // -------------------------------------------------------------------------
    if (dailyInterpretBtn && dailySanskritText) {
        dailyInterpretBtn.addEventListener("click", () => {
            const cleanText = dailySanskritText.innerText.trim();
            if (shlokaInput) {
                shlokaInput.value = cleanText;
                updateCharacterCount();
                hideValidation();
                hideError();

                // Set full mode
                modeButtons.forEach((b) => {
                    if (b.getAttribute("data-mode") === "full") {
                        b.classList.add("active");
                    } else {
                        b.classList.remove("active");
                    }
                });
                selectedMode = "full";

                document.getElementById("interpret").scrollIntoView({ behavior: "smooth" });
                shlokaInput.focus();

                // Trigger interpretation automatically for daily verse
                handleInterpretation();
            }
        });
    }

    // Interactive Term Pills in Learn Section
    document.querySelectorAll(".term-pill").forEach((pill) => {
        pill.addEventListener("click", () => {
            const termName = pill.textContent.trim();
            const verse = VOCABULARY_SHLOKAS[termName];

            if (verse && shlokaInput) {
                shlokaInput.value = verse;
                updateCharacterCount();
                hideValidation();
                hideError();
                document.getElementById("interpret").scrollIntoView({ behavior: "smooth" });
                shlokaInput.focus();
                showToast(`Loaded key shloka for ${termName}`);
            } else {
                showToast(`Selected concept: ${termName}`);
            }
        });
    });

    // Community CTA button
    const joinCommunityBtn = document.getElementById("joinCommunityBtn");
    if (joinCommunityBtn) {
        joinCommunityBtn.addEventListener("click", () => {
            showToast("Welcome to the Sanatana360 discussion circle! Feature coming soon.");
        });
    }

    // Footer links
    const footerAboutLink = document.getElementById("footerAboutLink");
    if (footerAboutLink) {
        footerAboutLink.addEventListener("click", () => {
            showToast("Sanatana360 is dedicated to preserving ancient Sanskrit wisdom.");
        });
    }
    const footerApiDocsLink = document.getElementById("footerApiDocsLink");
    if (footerApiDocsLink) {
        footerApiDocsLink.addEventListener("click", () => {
            showToast("FastAPI endpoint: POST /interpret at http://127.0.0.1:8000");
        });
    }
    const footerPrivacyLink = document.getElementById("footerPrivacyLink");
    if (footerPrivacyLink) {
        footerPrivacyLink.addEventListener("click", () => {
            showToast("Privacy: No sacred Sanskrit texts or user queries are sold.");
        });
    }
    const footerTermsLink = document.getElementById("footerTermsLink");
    if (footerTermsLink) {
        footerTermsLink.addEventListener("click", () => {
            showToast("Terms: For educational, spiritual, and contemplation purposes.");
        });
    }

    // -------------------------------------------------------------------------
    // 11. Helper: HTML Escaper
    // -------------------------------------------------------------------------
    function escapeHtml(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Initialize character counter
    updateCharacterCount();

})();
