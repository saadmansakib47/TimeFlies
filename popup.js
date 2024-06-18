document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('usageChart').getContext('2d');

    chrome.storage.local.get(null, (result) => {
        const labels = [];
        const data = [];
        for (let date in result) {
            labels.push(date);
            data.push(result[date]);
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Time spent on Facebook (seconds)',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
});
