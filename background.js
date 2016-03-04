chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	chrome.pageAction.show(tabId);
	if (tab.url.indexOf('https://store.playstation.com') === 0) {
		chrome.storage.local.get(function(cache) {
			if (!(cache && cache.count)) {
				chrome.tabs.executeScript({file: 'content.js'});
			}
		});
	}
});

chrome.pageAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript({file: 'content.js'}, function() {
		chrome.tabs.create({ url: chrome.extension.getURL('popup.html') });
	});
});
