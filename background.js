chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tab.url.indexOf('https://store.playstation.com') === 0) {
		chrome.pageAction.show(tabId);
		chrome.tabs.executeScript({file: 'content.js'});
	}
});

chrome.pageAction.onClicked.addListener(function(tab) {
	chrome.tabs.create({ url: chrome.extension.getURL('popup.html') });
});
