document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            const targetEl = document.getElementById(target);
            if (targetEl) targetEl.classList.add('active');
        });
    });

    // 2. Dark Mode Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const icon = themeBtn ? themeBtn.querySelector('i') : null;

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');

            // Swap icon between Moon and Sun
            if (document.body.classList.contains('dark-mode')) {
                if (icon) icon.className = 'fa-solid fa-sun';
            } else {
                if (icon) icon.className = 'fa-solid fa-moon';
            }
        });
    }
});
