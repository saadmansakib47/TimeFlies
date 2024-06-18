let facebookTime = 0;
let facebookTimer = null;

function startTimer() {
    if (!facebookTimer) {
        facebookTimer = setInterval(() => {
            facebookTime += 1;
            saveTime();
        }, 1000);
    }
}

function stopTimer() {
    if (facebookTimer) {
        clearInterval(facebookTimer);
        facebookTimer = null;
    }
}

function saveTime() {
    const today = new Date().toISOString().split('T')[0];
    chrome.storage.local.get([today], (result) => {
        const currentTime = result[today] || 0;
        const newTime = currentTime + 1;
        chrome.storage.local.set({ [today]: newTime });
    });
}

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && tab.url.includes('facebook.com')) {
            startTimer();
        } else {
            stopTimer();
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && tab.url && tab.url.includes('facebook.com')) {
        startTimer();
    } else {
        stopTimer();
    }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    stopTimer();
});
