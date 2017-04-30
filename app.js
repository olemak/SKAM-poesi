var language;
var activeId;
var sortedCounter = 0; // how many times has the row been sorted
var failMessage = "<h3>Beklager, det skjedde en feil!</h3><p>Merk at tjenesten for øyeblikket kun er testet for bruk i Google Chrome. Bruk i andre nettlesere (Firefox) vil gi feil eller slett ikke virke (MSIE/EDGE).<br>Merk også at SSB har faste nedetider hver dag pga. oppdatering av data. Dette kan være årsaken til feilen.</p>";
var displaySettings;

// Get list of all JSONs from SSB
function ssbAssetsList(){
	$.get('https://data.ssb.no/api/v0/dataset/list.json', {lang: language}, function(data){})
		.done(function(ssbList) {
			var selectForm = document.createElement('SELECT');
				selectForm.id = "ssbSelector";
				selectForm.name = "ssbSelector";
				for (dataset in ssbList.datasets) {
					var option = document.createElement("OPTION");
						option.value = ssbList.datasets[dataset].id;
						option.innerHTML = ssbList.datasets[dataset].title;
						selectForm.appendChild(option);
				}
			var statsHeader = document.getElementById("statsHeader");
				while (statsHeader.firstChild) statsHeader.removeChild(statsHeader.firstChild); 			// Remove existing selector select elements, if any 
				statsHeader.insertBefore(selectForm, document.getElementById("statsHeader").firstChild);	// Add the new selector element

			activeId = document.getElementById("statsHeader").elements.ssbSelector.value;
			ssbGetSource();

			document.getElementById("statsHeader").addEventListener("change", ssbGetSource);
		})
	.fail(function(){
		document.getElementById('statsBrowser').innerHTML = failMessage;
		
	})
	.always(function(){
		ssbSettings();
		// MAKE IT MULTILINGUAL
		document.getElementById("languagepicker").addEventListener("change", function(){
			language = document.getElementById("languagepicker").elements.lang.value;
			ssbAssetsList();
			document.getElementById('showSettingsLabel').innerHTML = (language === "en" ? "Show settings" : "Vis innstillinger");
		})		
	});
};

// Get individual JSONs from SSB
function ssbGetSource(){
	var activeId = document.getElementById("statsHeader").elements.ssbSelector.value;
	let url = 'http://data.ssb.no/api/v0/dataset/' + activeId + '.json';
	$.get(url, {lang: language}, function(data){
	})
		.done(function(ssbJSON){

			// CLEAN TABLE
			var oldTable = document.getElementById("statsBrowser")
			while (oldTable.firstChild) oldTable.removeChild(oldTable.firstChild);
			oldTable.classList.remove("wide");

			// GET JSON
			JSONstatUtils.tbrowser(
				JSONstat(ssbJSON),
				document.getElementById("statsBrowser")
				,{ 
					tblclass: "mainTable",
					preset: "bigger",
					locale: "no-NB"
				}
			);

			// Format and tweak table rows and cells, show settings, make rows sortable
			ssbShowSettings();
			ssbInitSortTable();

		})
		.fail(function(){
			document.getElementById('statsBrowser').innerHTML = failMessage;
		})
		.always(function(){
			//	Add wrap-up code here, if neccecary
		}),'json'
};	


// SORT TABLE ROWS
function tableSorter(){
	var parentTable = document.getElementsByClassName("mainTable")[0];
	var sortAscending = true, i, lastClicked; 			

	// LISTEN FOR "SORTING CLICKS" IN TABLE HEADER
	this.attachTheadListeners = function () {
		var tableHeads = parentTable.getElementsByTagName('thead')[0].getElementsByTagName('th');
		for (tableHead of tableHeads) {
			tableHead.addEventListener("click", this.sortTable);
			tableHead.classList.add("sortable");
		}
	}

	// DO THE SORTING
	this.sortTable = function (event) {
		i 	= Array.prototype.indexOf.call(event.target.offsetParent.getElementsByTagName('thead')[0].getElementsByTagName('th'), event.target);
		var tableBody 	= event.target.offsetParent.getElementsByTagName('tbody')[0];
		var currentCell;
		var description;
		var rowsArray 	= Array.prototype.slice.call(tableBody.rows).sort(function(a,b){
			if (i) {	
				a = parseFloat(a.children[i].dataset.number);
				b = parseFloat(b.children[i].dataset.number);
			} else {
				a = a.children[i].innerHTML;
				b = b.children[i].innerHTML;
			}
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		});

		// Alternate between ASC and DESC sort order for each time same header is clicked
		if (lastClicked === i && !(sortedCounter++ % 2)) { // Same header clicked more than once in a row, and  
			rowsArray.reverse();
			sortedCounter = 1;
		}
		console.log(lastClicked);

		lastClicked = function(x){return x;}(i);

		rowsArray.forEach(function(row, i){ tableBody.appendChild(row)});
	}
}


// Show settings table
function showSettings(){
	var showSettings = document.getElementById('showSettings');
		showSettings.innerHTML = (language === "en" ? "Show settings" : "Vis innstillinger");

		showSettings.addEventListener("click", function(){
			var settings = document.getElementsByClassName('mainTable')[0].caption;
			settings.style.display = "table-caption";

			var settingOptions = settings.querySelectorAll("select, input");

			for (var i = 0; i < settingOptions.length; i++) {
				settingOptions[i].addEventListener("change", ssbInitSortTable);
			};
		});
};


// MAKE THE SHOW SETTINGS FORM
function ssbSettings(){
	if (!window.settingsForm) {// ONLY DO THIS IF SETTIGNSFORM DOES NOT ALREADY EXIST!
		var showSettings = document.createElement('FORM');
			showSettings.setAttribute("id", "settingsForm");
			showSettings.setAttribute("name", "showSettings");

		var form = document.createElement('INPUT');
			form.setAttribute("type", "checkbox");
			form.setAttribute("name", "show");
			form.setAttribute("id", "showSettings");
			form.setAttribute("value", "show");

		var inputLabel = document.createElement("LABEL");
			inputLabel.setAttribute("for", "showSettings");
			inputLabel.setAttribute("id", "showSettingsLabel")
			inputLabel.innerHTML = ( language === "en" ? "Show settings" : "Vis innstillinger");

			showSettings.appendChild(form);
			showSettings.appendChild(inputLabel);

			// SHOW OR HIDE THE OPTIONS/TABLE CAPTION IF THE CHECKBOX IS CLICKED
			showSettings.addEventListener("change", ssbShowSettings);

		var options = document.getElementById("options");
			options.insertBefore(showSettings, options.firstChild);
	}
}

// Format and tweak table rows and cells
function tweakTable(tableBody){
	console.log("tweaking");
	for (var row = 0; row < tableBody.rows.length; row++) {
		tableBody.rows[row].addEventListener("click", function(){
			this.classList.toggle("selected");
		});
		for (cell in tableBody.rows[row].cells) {
			if (cell > 0) {
				currentCell = tableBody.rows[row].cells[cell];
				currentCell.dataset.number = (currentCell.innerHTML).replace(/,/g, '');
				currentCell.dataset.rowtitle = tableBody.rows[row].cells[0].innerText;
				currentCell.dataset.headertitle = tableBody.rows[0].cells[cell].innerText;
			}
		}
	}
}

// TOGGLE SETTINGS DISPLAY ON CHECKBOX INTERACTION
function ssbShowSettings(){
	($("#showSettings").is(":checked") 
		? $($(".mainTable")[0].caption).css({"display": "table-caption"}) 
		: $($(".mainTable")[0].caption).hide()
	);
}

function ssbSettingsEventListeners(){
	$($(".mainTable")[0].caption).on("change", ssbInitSortTable);
}

function ssbAdjustTableWidth(container){
	if (window.innerWidth < container.firstChild.offsetWidth) {
		container.classList.add("wide");
	}
}

function ssbInitSortTable(){
	var sortableTable = new tableSorter();
	sortableTable.attachTheadListeners();
}

// INIT 
$().ready(function(){
	language = document.getElementById("languagepicker").elements.lang.value;
	ssbAssetsList();
	
	// KEEP AN EYE OUT FOR CHANGES
	var target = document.getElementById("statsBrowser");
	var config = { attributes: true, childList: true, characterData: true };
	var observer = new MutationObserver(function(mutations){
		mutations.forEach(function(mutation){
			tweakTable(document.getElementsByClassName("mainTable")[0]);
			ssbSettingsEventListeners();
	 		ssbAdjustTableWidth(target);
		});
	});
		observer.observe(target, config);
});