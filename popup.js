function unpackEntitlements(info) {
	if (info) {
		console.log(info);
		document.getElementById('number').textContent = info.length;
		var contentTable = document.getElementById('content');
		for (var i = 0; i < info.length; i++) {
			var row = contentTable.insertRow(-1);
			var nameCell = row.insertCell(-1);
			// var typeCell = row.insertCell(1);
			var dateCell = row.insertCell(-1);
			var idCell = row.insertCell(-1);

			var itemName = '__Internal Entitlement__ #' + i;
			if (info[i].drm_def) itemName = info[i].drm_def.contentName;
			if (info[i].game_meta) itemName = info[i].game_meta.name;
			var itemLink = '<a href="https://store.playstation.com/#!/cid=' + info[i].id + '">' + info[i].id + '</a>';

			nameCell.innerHTML = itemName;
			// typeCell.innerHTML = item.type;
			dateCell.innerHTML = info[i].active_date;
			idCell.innerHTML = itemLink;
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
