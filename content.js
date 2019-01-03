if (storageHasEntitlement()) {
	// Get raw entitlements string from PSStore local storage
	var entitlements = [];
	for (i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		if (key.startsWith('entitlements_')) {
			var rawEntitlements = JSON.parse(localStorage[key]);
			rawEntitlements.forEach(function (rawItem) {
				entitlements.push(parseEntitlement(rawItem));
			})
		}
	}
	// Save/update formatted enetitlements to cache only when count changes
	chrome.storage.local.get(function (items) {
		if (!(items && items.count && items.count === entitlements.length)) {
			chrome.storage.local.set({
				'entitlements': entitlements,
				'count': entitlements.length,
				'timestamp': Date()
			}, function () {
				console.log('PSSP: ' + entitlements.length + ' items saved.');
			});
		}
	})
} else {
	// cleading cache when user sign out of PSS
	console.log('PSSP: Cannot find local storage of entitlements. Clearing cache.');
	chrome.storage.local.remove(['entitlements', 'count', 'timestamp']);
}

function parseEntitlement(entitlement) {
	var platformFlags = [2147483648, 1073741824, 0, 0, 134217728, 0, 0, 0, 0];
	var platformNames = ['PS3', 'PSP', 'MediaGo', 'Xperia', 'PSVita', 'Sony Tablet', 'BIVL', 'Chihiro', 'Generic Mobile'];

	var item = {
		'name': '__ENTITLEMENT__',
		'size': 0,
		'date': entitlement.active_date,
		'platform': 'License',
		'type': 'Entitlement',
		'id': entitlement.id,
		'plus': false
	};

	if (entitlement.drm_def) {
		item.name = entitlement.drm_def.contentName;
		item.size = entitlement.drm_def.drmContents[0].contentSize;
		platformFlags.forEach(function (flag, index) {
			if (entitlement.drm_def.drmContents[0].platformIds & flag) {
				item.platform = (platformNames[index]);
				item.type = 'Game'
			}
		});
	} else if (entitlement.game_meta) {
		item.name = entitlement.game_meta.name;
	}

	if (entitlement.entitlement_attributes) {
		item.platform = 'PS4';
		item.size = entitlement.entitlement_attributes[0].package_file_size;
	}

	if (entitlement.game_meta && entitlement.game_meta.type) {
		item.type = entitlement.game_meta.type;
		switch (entitlement.game_meta.type) {
			case 'PS4GD':
				item.type = 'Game'
				break;
			case 'PS4AC':
				item.type = 'DLC'
				break;
			case 'PS4AL':
				item.type = 'DLC'
				break;
			case 'PS4MISC':
				item.type = 'Extra'
				break;
		}
	}

	if (entitlement.license && entitlement.license.expiration) item.plus = true;
	if (entitlement.inactive_date && item.platform == 'PS4') item.plus = true;
	return item;
}

function storageHasEntitlement() {
	for (let index = 0; index < localStorage.length; index++) {
		if (localStorage.key(index).includes('entitlements_')) return true;
	}
	return false;
}
