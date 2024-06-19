let timerInterval;
let totalTime = 0;
let activeTabId = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab && tab.url && tab.url.includes('facebook.com')) {
            startTimer(activeInfo.tabId);
        } else {
            stopTimer();
        }
    });
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId === activeTabId) {
        stopTimer();
    }
});

function startTimer(tabId) {
    if (tabId !== activeTabId) {
        stopTimer();
        activeTabId = tabId;
        timerInterval = setInterval(updateTimer, 1000);
        saveState(); // Save timer state when starting
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        saveState(); // Save timer state when stopping
        activeTabId = null;
    }
}

function updateTimer() {
    totalTime++;
    saveState(); // Save state on each timer tick
}

function saveState() {
    chrome.storage.local.set({ activeTabId, totalTime });
}

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
