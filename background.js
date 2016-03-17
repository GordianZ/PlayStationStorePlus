chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tab.url.indexOf('https://store.playstation.com') === 0) {
		chrome.storage.local.get(function(cache) {
			if (!(cache && cache.count && (Date() - cache.timstamp < 5000))) {
				chrome.tabs.executeScript({file: 'content.js'});
			}
		});
	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.create({ url: chrome.extension.getURL('popup.html') });
});
