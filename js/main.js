document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Tab Switching Logic ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
        });
     const toggleBtn = document.getElementById('theme-toggle');
    toggleBtn?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
