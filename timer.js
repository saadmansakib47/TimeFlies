let timerInterval;
let totalTime = 0;
let activeTabId = null;
let alertTimeLimit = 300; // Default alert time limit (5 minutes in seconds)

document.addEventListener('DOMContentLoaded', () => {
    updateTimerDisplay();
    setInterval(updateTimerDisplay, 1000); // Update timer display every second

    // Restore state when the extension popup is opened
    restoreState();

    // Check initial tab state
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.url && activeTab.url.includes('facebook.com')) {
            startTimer(activeTab.id);
        } else {
            stopTimer();
        }
    });

    // Listen for tab activation changes
    chrome.tabs.onActivated.addListener((activeInfo) => {
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (tab && tab.url && tab.url.includes('facebook.com')) {
                startTimer(activeInfo.tabId);
            } else {
                stopTimer();
            }
        });
    });

    // Listen for tab removal
    chrome.tabs.onRemoved.addListener((tabId) => {
        if (tabId === activeTabId) {
            stopTimer();
        }
    });
});

// Function to start the timer
function startTimer(tabId) {
    if (tabId !== activeTabId) {
        stopTimer();
        activeTabId = tabId;
        timerInterval = setInterval(() => {
            totalTime++;
            saveState(); // Save state on each timer tick
            updateTimerDisplay(); // Update timer display on each tick
            checkTimeLimit(); // Check if time limit exceeded
        }, 1000);
        saveState();
    }
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    activeTabId = null;
    saveState();
}

// Function to update the timer display
function updateTimerDisplay() {
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    const seconds = totalTime % 60;

    const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    document.getElementById('timer').textContent = formattedTime;
}

// Function to check if time limit is exceeded and display notification
function checkTimeLimit() {
    if (totalTime >= alertTimeLimit) {
        showNotification();
        stopTimer(); // Stop timer when time limit exceeded
    }
}

// Function to show a notification
function showNotification() {
    const notificationOptions = {
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'TimeFlies Alert',
        message: `You have spent ${alertTimeLimit / 60} minutes on Facebook. Take a break!`
    };
    chrome.notifications.create('timeLimitNotification', notificationOptions);
}

// Function to save the current state of timer to chrome.storage.local
function saveState() {
    chrome.storage.local.set({ activeTabId, totalTime });
}

// Function to pad single digit numbers with leading zeros (e.g., 1 -> "01")
function padZero(num) {
    return (num < 10 ? '0' : '') + num;
}

// Function to restore the state of the timer from chrome.storage.local
function restoreState() {
    chrome.storage.local.get(['activeTabId', 'totalTime'], (result) => {
        activeTabId = result.activeTabId || null;
        totalTime = result.totalTime || 0;
        if (activeTabId) {
            startTimer(activeTabId);
        }
    });
}

// Initial restore state
restoreState();
