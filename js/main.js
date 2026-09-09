document.addEventListener('DOMContentLoaded', () => {
    // --- 1. TAB SWITCHING ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            // Re-initialize SPR dashes whenever user switches to Research tab
            if (targetId === 'research') {
                initSPR();
            }
        });
    });

    // --- 2. DARK MODE TOGGLE ---
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            themeBtn.innerHTML = isDark 
                ? '<i class="fa-solid fa-sun"></i> Light Mode' 
                : '<i class="fa-solid fa-moon"></i> Dark Mode';
        });
    }

    // --- 3. MASKED MOVING-WINDOW SPR DEMO ---
    const sprSentence = ["Two", "widely", "used", "paradigms", "in", "sentence", "processing", "were", "compared", "across", "two", "testing", "sessions."];
    let sprIndex = -1;
    let sprStartTime = 0;

    const sprDisplayEl = document.getElementById('spr-display');
    const sprTimerEl = document.getElementById('spr-timer');
    const sprBtn = document.getElementById('spr-next-btn');

    // Build masked sentence dashes
    function initSPR() {
        if (!sprDisplayEl) return;
        sprDisplayEl.innerHTML = '';
        sprSentence.forEach((word) => {
            const span = document.createElement('span');
            span.className = 'spr-word-mask';
            span.textContent = '-'.repeat(word.length);
            sprDisplayEl.appendChild(span);
        });
        sprIndex = -1;
        if (sprTimerEl) sprTimerEl.innerHTML = 'Press SPACE to begin...';
    }

    // Unmask word & calculate RT
    function advanceSPR() {
        if (!sprDisplayEl) return;
        const now = performance.now();
        const wordSpans = sprDisplayEl.querySelectorAll('.spr-word-mask');

        if (wordSpans.length === 0) {
            initSPR();
            return;
        }

        // First press: Reveal word 0
        if (sprIndex === -1) {
            sprIndex = 0;
            wordSpans[0].textContent = sprSentence[0];
            wordSpans[0].classList.add('active-word');
            sprStartTime = performance.now();
            if (sprTimerEl) sprTimerEl.innerHTML = `Word 1/${sprSentence.length} revealed.`;
            return;
        }

        // Calculate RT for previous word
        const rt = Math.round(now - sprStartTime);

        // Re-mask previous word
        wordSpans[sprIndex].textContent = '-'.repeat(sprSentence[sprIndex].length);
        wordSpans[sprIndex].classList.remove('active-word');

        sprIndex++;

        // Trial completed
        if (sprIndex >= sprSentence.length) {
            if (sprTimerEl) sprTimerEl.innerHTML = `Trial complete! Final RT: <strong>${rt} ms</strong>. Press SPACE to restart.`;
            initSPR();
            return;
        }

        // Unmask next word
        wordSpans[sprIndex].textContent = sprSentence[sprIndex];
        wordSpans[sprIndex].classList.add('active-word');
        sprStartTime = performance.now();

        if (sprTimerEl) {
            sprTimerEl.innerHTML = `Word ${sprIndex + 1}/${sprSentence.length} RT: <strong>${rt} ms</strong>`;
        }
    }

    // Run initial setup
    if (sprDisplayEl) {
        initSPR();
    }

    if (sprBtn) {
        sprBtn.addEventListener('click', advanceSPR);
    }

    // Spacebar listener
    window.addEventListener('keydown', (e) => {
        const researchTab = document.getElementById('research');
        if (e.code === 'Space' && researchTab && researchTab.classList.contains('active')) {
            e.preventDefault(); // Stop page scrolling
            advanceSPR();
        }
    });
});
