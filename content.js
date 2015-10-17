chrome.runtime.onMessage.addListener(function(message, sender, response) {
	if ((message.from === 'popup') && (message.subject === 'GetEntitlements')) {
		if (typeof localStorage['MgrEntitlements|chihiro.entitlements'] !== 'undefined') {
			var entitlements = JSON.parse(localStorage['MgrEntitlements|chihiro.entitlements']);
			response(entitlements);
		} else {
			response(null);
		}
	}
	console.log(KamajiPlatformFlags);
});
