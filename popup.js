var contentTable = document.getElementById('content');
var checkboxes = document.getElementsByClassName('checkbox');

// document.getElementById('refresh').onclick = renderData();

function renderData() {
	chrome.storage.local.get(null, function(items){
		document.getElementById('number').textContent = items.count;
		for (var i = 0; i < items.count; i++) {
			var item = items.entitlements[i];
			var row = contentTable.insertRow(-1);
			var noCell = row.insertCell(-1);
			noCell.setAttribute('class', 'no');
			noCell.innerHTML = i;
			var nameCell = row.insertCell(-1);
			nameCell.innerHTML = item.name;
			var platformCell = row.insertCell(-1);
			platformCell.innerHTML = item.platform;
			platformCell.setAttribute('class', 'platform');
			var typeCell = row.insertCell(-1);
			typeCell.innerHTML = item.type;
			var sizeCell = row.insertCell(-1);
			sizeCell.innerHTML = formatSize(item.size);
			sizeCell.setAttribute('sorttable_customkey', item.size);
			var dateCell = row.insertCell(-1);
			dateCell.innerHTML = item.date;
			var idCell = row.insertCell(-1);
			idCell.innerHTML = linkfy(item.id);
			idCell.setAttribute('class', 'monospace');
			row.setAttribute('class', 'type--' + item.platform.toLowerCase());
		}
		sorttable.makeSortable(contentTable);

		var jets = new Jets({
			searchTag: '#inputSearch',
			contentTag: '#content > tbody',
			columns: [1, 2, 3, 5, 6]
		});

		for (var i = 0; i < checkboxes.length; i++) {
			checkboxes[i].checked = items.toggles[i];
			checkboxes[i].addEventListener('change', filterPlatforms);
		}
		filterPlatforms();
		toggleRows();
	});
}

function filterPlatforms() {
	var checkboxVals = [];
	for (var i = 0; i < checkboxes.length; i++) {
		checkboxVals.push(checkboxes[i].checked);
	}
	console.log(checkboxVals);
	chrome.storage.local.set({'toggles': checkboxVals});
	toggleRows();
}

function toggleRows() {
	chrome.storage.local.get('toggles', function(platform) {
		if (chrome.runtime.lastError) {
			console.log(chrome.runtime.lastError.message);
			return;
		}
		var platformClasses = ['type--license', 'type--ps4', 'type--ps3', 'type--psvita', 'type--psp'];
		var rows = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
		console.log(rows.length);
		for (var i = 0; i < rows.length; i++) {
			var toggle = platform.toggles[platformClasses.indexOf(rows[i].className)];
			rows[i].style.display = toggle ? '' : 'none';
			// console.log(rows[i]);
		}
	});
}

function formatSize(bytes) {
	if (typeof bytes !== 'number') return bytes;
	if (bytes > 1073741824) return (bytes/1073741824).toFixed(2) + ' GB';
	if (bytes > 1048576) return (bytes/1048576).toFixed(2) + ' MB';
	if (bytes > 1024) return (bytes/1024).toFixed(2) + ' kB';
	return bytes + ' B';
}

function linkfy(id) {
	return '<a href="https://store.playstation.com/#!/cid=' + id + '">' + id + '</a>';
}

renderData();
