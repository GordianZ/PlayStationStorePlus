chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tab.url.indexOf('https://store.playstation.com') === 0) {
		chrome.pageAction.show(tabId);
	}
});

chrome.pageAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript({file: 'content.js'});
	chrome.tabs.create({
		url: chrome.extension.getURL('popup.html')
	}, function(popup) {
		chrome.tabs.sendMessage(
			popup.id, {
				from: 'background',
				subject: 'ContentTabId',
				id: tab.id
			});
	});
});
