document.getElementById('toggleLicense').onchange = function(){toggleRow('License')};
document.getElementById('togglePS4').onchange = function(){toggleRow('PS4')};
document.getElementById('togglePS3').onchange = function(){toggleRow('PS3')};
document.getElementById('togglePSVita').onchange = function(){toggleRow('PSVita')};
document.getElementById('togglePSP').onchange = function(){toggleRow('PSP')};
// document.getElementById('refresh').onclick = renderData();

function renderData() {
	chrome.storage.local.get(null, function(items){
		document.getElementById('number').textContent = items.count;
		var contentTable = document.getElementById('content');
		var length = items.count;
		for (var i = 0; i < length; i++) {
			var item = items.entitlements[i];
			var row = contentTable.insertRow(-1);
			var noCell = row.insertCell(-1);
			noCell.setAttribute('class', 'no');
			noCell.innerHTML = i;
			var nameCell = row.insertCell(-1);
			nameCell.innerHTML = item.name;
			var platformCell = row.insertCell(-1);
			platformCell.innerHTML = item.platform;
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
			row.setAttribute('class', item.platform.toLowerCase());
		}
		sorttable.makeSortable(contentTable);
	});
}

function toggleRow(rowClass) {
	var toggle = document.getElementById('toggle' + rowClass).checked;
	var rows = document.getElementsByClassName(rowClass);
	for (var i = 0; i < rows.length; i++) {
		rows[i].style.display = toggle ? 'table-row' : 'none';
		// console.log(rows[i]);
	}
}


function formatSize(bytes) {
	if (typeof bytes !== "number") return bytes;
	if (bytes > 1073741824) return (bytes/1073741824).toFixed(2) + ' GB';
	if (bytes > 1048576) return (bytes/1048576).toFixed(2) + ' MB';
	if (bytes > 1024) return (bytes/1024).toFixed(2) + ' kB';
	return bytes + ' B';
}

function linkfy(id) {
	return '<a href="https://store.playstation.com/#!/cid=' + id + '">' + id + '</a>';
}

renderData();
