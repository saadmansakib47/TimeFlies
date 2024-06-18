document.addEventListener('DOMContentLoaded', () => {
    updateTimerDisplay();

    // Update timer display every second
    setInterval(updateTimerDisplay, 1000);
});

function updateTimerDisplay() {
    chrome.storage.local.get(['totalTime'], (result) => {
        const totalTime = result.totalTime || 0;
        const hours = Math.floor(totalTime / 3600);
        const minutes = Math.floor((totalTime % 3600) / 60);
        const seconds = totalTime % 60;

        const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
        document.getElementById('timer').textContent = formattedTime;
    });
}

function padZero(num) {
    return (num < 10 ? '0' : '') + num;
}
