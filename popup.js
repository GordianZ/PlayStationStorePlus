document.getElementById('toggleInternal').onchange = function(){toggleRow('Internal')};
// document.getElementById('togglePS4').onchange = function(){toggleRow('PS4')};
// document.getElementById('togglePS3').onchange = function(){toggleRow('PS3')};

function toggleRow(rowClass) {
	var toggle = document.getElementById('toggle' + rowClass).checked;
	var rows = document.getElementsByClassName(rowClass);
	for (var i = 0; i < rows.length; i++) {
		rows[i].style.display = toggle ? 'none' : 'table-row';
		// console.log(rows[i]);
	}
};

function unpackEntitlements(info) {
	if (info) {
		console.log(info);
		document.getElementById('number').textContent = info.length;
		var contentTable = document.getElementById('content');
		for (var i = 0; i < info.length; i++) {
			var row = contentTable.insertRow(-1);
			var noCell = row.insertCell(-1);
			var nameCell = row.insertCell(-1);
			var typeCell = row.insertCell(-1);
			var sizeCell = row.insertCell(-1);
			var dateCell = row.insertCell(-1);
			var idCell = row.insertCell(-1);

			var itemName = '__Internal Entitlement__ #' + i;
			var itemSize = -1;
			if (info[i].drm_def) {
				itemName = info[i].drm_def.contentName;
				itemSize = info[i].drm_def.drmContents[0].contentSize;
			}
			// if (info[i].game_meta) {
			// 	itemName = info[i].game_meta.name;
			// 	itemSize = info[i].entitlement_attributes[0].package_file_size;
			// }
			var itemLink = '<a href="https://store.playstation.com/#!/cid=' + info[i].id + '">' + info[i].id + '</a>';
			var itemType = 'UNKNOWN';
			switch (info[i].entitlement_type) {
				case 5:
					itemType = 'PS4';
					row.setAttribute('class', 'PS4');
					break;
				case 2:
					itemType = 'PS3/PSV';
					row.setAttribute('class', 'PS3');
					break;
				default:
					itemType = info[i].entitlement_type;
			}
			// switch (info[i].feature_type) {
			// 	case 3:
			// 		itemType += ' Game';
			// 		break;
			// 	case 0:
			// 		itemType += ' DLC';
			// 		break;
			// 	default:
			// 		itemType += ' Entitlement';
			// }

			noCell.innerHTML = i;
			nameCell.innerHTML = itemName;
			typeCell.innerHTML = itemType;
			sizeCell.innerHTML = formatSize(itemSize);
			sizeCell.setAttribute('sorttable_customkey', itemSize);
			dateCell.innerHTML = info[i].active_date;
			idCell.innerHTML = itemLink;

			if (itemSize == -1) {
				row.setAttribute('class', 'Internal');
				row.style.display = 'none';
			}
		}
		sorttable.makeSortable(contentTable);
	}
}

chrome.runtime.onMessage.addListener(function(message, sender, response) {
	if ((message.from === 'background') && (message.subject === 'ContentTabId')) {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			chrome.tabs.sendMessage(
				message.id, {
					from: 'popup',
					subject: 'GetEntitlements'
				},
				unpackEntitlements);
		});
	}
});

function formatSize(bytes) {
	if (bytes > 1073741824) return (bytes/1073741824).toFixed(2) + ' GB';
	if (bytes > 1048576) return (bytes/1048576).toFixed(2) + ' MB';
	if (bytes > 1024) return (bytes/1024).toFixed(2) + ' kB';
	return bytes + ' B';
};
