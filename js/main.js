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
    });

    // --- 2. Chart.js Trajectory Visual ---
    const ctx = document.getElementById('trajectoryChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2020', '2021', '2022', '2023', '2024', '2025 (Est.)'],
            datasets: [
                {
                    label: 'Model Interpretability',
                    data: [80, 70, 40, 20, 10, 5],
                    borderColor: '#94a3b8',
                    backgroundColor: 'rgba(148, 163, 184, 0.15)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Human-AI Teaming',
                    data: [20, 30, 60, 70, 60, 45],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.15)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Adaptive Neuro-AI',
                    data: [0, 0, 0, 10, 30, 50],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { family: 'Inter', size: 12 } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}% Research Effort`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    stacked: true,
                    max: 100,
                    ticks: { callback: value => value + '%' },
                    grid: { color: '#f1f5f9' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
});
