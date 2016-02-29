if (typeof localStorage['MgrEntitlements|chihiro.entitlements'] !== 'undefined') {
	// Get raw entitlements string from PSStore local storage
	var rawEntitlements = JSON.parse(localStorage['MgrEntitlements|chihiro.entitlements']);
	var entitlements = [];
	rawEntitlements.forEach(function(rawItem) {
		entitlements.push(parseEntitlement(rawItem));
	})
	// Save formatted enetitlements to extension storage
	chrome.storage.local.set({
		"entitlements": entitlements,
		"count": entitlements.length
	}, function() {
		console.log("PSSP: " + entitlements.length + " items saved.");
	});
};

function parseEntitlement(entitlement) {
	var platformFlags = [2147483648, 1073741824, 0, 0, 134217728, 0, 0, 0, 0];
	var platformNames = ["PS3", "PSP", "MediaGo", "Xperia", "PSVita", "Sony Tablet", "BIVL", "Chihiro", "Generic Mobile"];

	var item = {
		"name": "__ENTITLEMENT__",
		"size": 0,
		"date": entitlement.active_date,
		"platform": "License",
		"type": "Entitlement",
		"id": entitlement.id
	};

	if (entitlement.drm_def) {
		item.name = entitlement.drm_def.contentName;
		item.size = entitlement.drm_def.drmContents[0].contentSize;
		platformFlags.forEach(function(flag, index) {
			if (entitlement.drm_def.drmContents[0].platformIds & flag) {
				item.platform = (platformNames[index]);
			}
		});
	} else if (entitlement.game_meta) {
		item.name = entitlement.game_meta.name;
	}

	if (entitlement.entitlement_attributes) {
		item.platform = "PS4";
		item.size = entitlement.entitlement_attributes[0].package_file_size;
	}

	if (entitlement.game_meta && entitlement.game_meta.type) {
		item.type = entitlement.game_meta.type;
		switch (entitlement.game_meta.type) {
			case "PS4GD":
				item.type = "Game"
				break;
			case "PS4AC":
				item.type = "DLC"
				break;
			case "PS4AL":
				item.type = "DLC"
				break;
			case "PS4MISC":
				item.type = "Extra"
				break;
		}
	}

	return item;
}
