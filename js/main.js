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
// --- 4. A-MAZE TASK DEMO LOGIC ---
    const mazeSentence = [
        { word: "The", distractor: "---" },
        { word: "researchers", distractor: "communicate" },
        { word: "compared", distractor: "brother" },
        { word: "individual", distractor: "facilitate" },
        { word: "differences", distractor: "beautifully" },
        { word: "in", distractor: "go" },
        { word: "working", distractor: "cabinet" },
        { word: "memory", distractor: "danced" },
        { word: "capacity.", distractor: "passions." }
    ];

    let mazeIndex = -1;
    let mazeStartTime = 0;
    let correctIsLeft = true;
    let mazeActive = false;

    const startBtn = document.getElementById('maze-start-btn');
    const btnLeft = document.getElementById('maze-btn-left');
    const btnRight = document.getElementById('maze-btn-right');
    const textLeft = document.getElementById('maze-text-left');
    const textRight = document.getElementById('maze-text-right');
    const mazeTimerEl = document.getElementById('maze-timer');
    const mazeResetBtn = document.getElementById('maze-reset-btn');

    function initMaze() {
        mazeIndex = -1;
        mazeActive = false;
        if (startBtn) startBtn.style.display = 'inline-flex';
        if (btnLeft) btnLeft.style.display = 'none';
        if (btnRight) btnRight.style.display = 'none';
        if (mazeTimerEl) mazeTimerEl.innerHTML = "Click 'Start Task' to begin...";
    }

    function startMaze() {
        mazeActive = true;
        mazeIndex = 0;
        if (startBtn) startBtn.style.display = 'none';
        if (btnLeft) btnLeft.style.display = 'flex';
        if (btnRight) btnRight.style.display = 'flex';
        if (mazeTimerEl) mazeTimerEl.innerHTML = `Word 1/${mazeSentence.length}`;
        setupMazeStep();
    }

    function setupMazeStep() {
        if (mazeIndex >= mazeSentence.length) {
            if (mazeTimerEl) mazeTimerEl.innerHTML = `Maze complete! Sentence navigated successfully!`;
            mazeActive = false;
            return;
        }

        const item = mazeSentence[mazeIndex];
        correctIsLeft = Math.random() < 0.5;

        if (textLeft && textRight) {
            textLeft.textContent = correctIsLeft ? item.word : item.distractor;
            textRight.textContent = correctIsLeft ? item.distractor : item.word;
        }

        mazeStartTime = performance.now();
    }

    function handleMazeChoice(chosenLeft) {
        // Do nothing if task hasn't been started with the button yet
        if (!mazeActive) return;

        const now = performance.now();
        const rt = Math.round(now - mazeStartTime);

        if (chosenLeft === correctIsLeft) {
            mazeIndex++;
            if (mazeIndex < mazeSentence.length) {
                if (mazeTimerEl) mazeTimerEl.innerHTML = `Word ${mazeIndex + 1}/${mazeSentence.length} | RT: <strong>${rt} ms</strong>`;
                setupMazeStep();
            } else {
                if (mazeTimerEl) mazeTimerEl.innerHTML = `Trial complete! Navigated with 0 errors.`;
                if (textLeft) textLeft.textContent = "Finished!";
                if (textRight) textRight.textContent = "Finished!";
                mazeActive = false;
            }
        } else {
            if (mazeTimerEl) mazeTimerEl.innerHTML = `❌ <strong>Mistake!</strong> Dead end at word ${mazeIndex + 1}. Press Reset to retry.`;
            mazeActive = false;
        }
    }

    if (startBtn) startBtn.addEventListener('click', startMaze);
    if (btnLeft && btnRight) {
        initMaze();
        btnLeft.addEventListener('click', () => handleMazeChoice(true));
        btnRight.addEventListener('click', () => handleMazeChoice(false));
        if (mazeResetBtn) mazeResetBtn.addEventListener('click', initMaze);
    }

    // --- 5. KEYBOARD LISTENERS ---
    window.addEventListener('keydown', (e) => {
        const researchTab = document.getElementById('research');
        if (researchTab && researchTab.classList.contains('active')) {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            const key = e.key.toLowerCase();

            if (e.code === 'Space') {
                e.preventDefault();
                advanceSPR();
            } else if (key === 'f') {
                e.preventDefault();
                handleMazeChoice(true);
            } else if (key === 'j') {
                e.preventDefault();
                handleMazeChoice(false);
            }
        }
    });
document.addEventListener('DOMContentLoaded', function() {
  var typed = new Typed('#typed-target', {
    strings: [
      'Why do reading abilities diverge?',
      'What brain architecture underpins individual reading skill?',
      'Is reading variation driven by domain-general resources?',
      'How does reading skill change over time?'
    ],
    typeSpeed: 40,      // Speed of typing in ms
    backSpeed: 25,      // Speed of backspacing in ms
    backDelay: 2200,    // Pause duration when sentence completes (ms)
    startDelay: 400,    // Initial delay before typing starts (ms)
    loop: true,         // Loop indefinitely
    showCursor: true,
    cursorChar: '|'
  });
});
document.addEventListener('DOMContentLoaded', function() {

  // 1. Mouse-Tracking Radial Glow in Hero
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hero.style.setProperty('--mouse-x', `${x}px`);
      hero.style.setProperty('--mouse-y', `${y}px`);
    });
  }
});
