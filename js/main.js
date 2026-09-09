document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
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
        });
    });

    // Dark Mode Toggle
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
});
// Interactive Masked Moving-Window SPR Demo
    const sprSentence = ["Two", "widely", "used", "paradigms", "in", "sentence", "processing", "were", "compared", "across", "two", "testing", "sessions."];
    let sprIndex = -1;
    let sprStartTime = 0;

    const sprDisplayEl = document.getElementById('spr-display');
    const sprTimerEl = document.getElementById('spr-timer');
    const sprBtn = document.getElementById('spr-next-btn');

    // Generate masked sentence (dashes matching character counts)
    function initSPR() {
        if (!sprDisplayEl) return;
        sprDisplayEl.innerHTML = '';
        sprSentence.forEach((word) => {
            const span = document.createElement('span');
            span.className = 'spr-word-mask';
            // Mask each letter with a dash
            span.textContent = '-'.repeat(word.length);
            sprDisplayEl.appendChild(span);
        });
        sprIndex = -1;
        if (sprTimerEl) sprTimerEl.innerHTML = 'Press SPACE to begin...';
    }

    function advanceSPR() {
        if (!sprDisplayEl) return;
        const now = performance.now();
        const wordSpans = sprDisplayEl.querySelectorAll('.spr-word-mask');

        // First press: Start task and reveal word 0
        if (sprIndex === -1) {
            sprIndex = 0;
            wordSpans[0].textContent = sprSentence[0];
            wordSpans[0].classList.add('active-word');
            sprStartTime = performance.now();
            if (sprTimerEl) sprTimerEl.innerHTML = `Word 1/${sprSentence.length} revealed.`;
            return;
        }

        // Calculate Reaction Time for previous word
        const rt = Math.round(now - sprStartTime);

        // Re-mask previous word
        wordSpans[sprIndex].textContent = '-'.repeat(sprSentence[sprIndex].length);
        wordSpans[sprIndex].classList.remove('active-word');

        // Advance index
        sprIndex++;

        // Sentence completed
        if (sprIndex >= sprSentence.length) {
            if (sprTimerEl) sprTimerEl.innerHTML = `Trial complete! Final RT: <strong>${rt} ms</strong>. Press SPACE to restart.`;
            initSPR();
            return;
        }

        // Unmask current word
        wordSpans[sprIndex].textContent = sprSentence[sprIndex];
        wordSpans[sprIndex].classList.add('active-word');
        sprStartTime = performance.now();

        if (sprTimerEl) {
            sprTimerEl.innerHTML = `Word ${sprIndex + 1}/${sprSentence.length} RT: <strong>${rt} ms</strong>`;
        }
    }

    if (sprBtn) {
        initSPR();
        sprBtn.addEventListener('click', advanceSPR);

        window.addEventListener('keydown', (e) => {
            const researchTab = document.getElementById('research');
            if (e.code === 'Space' && researchTab && researchTab.classList.contains('active')) {
                e.preventDefault();
                advanceSPR();
            }
        });
    }
