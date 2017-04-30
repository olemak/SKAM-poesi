function getSubtitle (programID, path) {
	const DomParser = require('dom-parser');
	const request = require('request');
    
    request.get(`http://v8.psapi.nrk.no/programs/${programID}/subtitles/tt`, (error, response, body) => {
		if (response.statusCode === 200) {
			let parser = new DomParser();
			let result = parser.parseFromString(body, "text/xml");

			let allTextLines = result.getElementsByTagName("p");
			let saveText = [];
			for (let i = 1; i <= allTextLines.length; i++) {
				if (typeof allTextLines[i] !== 'undefined') {
					saveText.push(allTextLines[i].innerHTML
							.replace( /\<[^)]*\>/ , " ")
							.replace( /\([^)]*\)/ , " "));
				}
			}
			saveAsJson(saveText, path)
		}
	})
}

function saveAsJson(data, path) {
	let fs = require('fs');

	saveData = JSON.stringify(data)	
	fs.writeFile(path + ".json", saveData)
}


function getThenSave (episodes, basePath) {
	episodes.map( episode => {
		getSubtitle(episode.id, basePath + episode.saveName)
	})
}


let skamEpisodes = [
	{ id: "MSUB19120116", saveName: "skam_s01_e01"},
	{ id: "MSUB19120216", saveName: "skam_s01_e02"},
	{ id: "MSUB19120316", saveName: "skam_s01_e03"},
	{ id: "MSUB19120416", saveName: "skam_s01_e04"},
	{ id: "MSUB19120516", saveName: "skam_s01_e05"},
	{ id: "MSUB19120616", saveName: "skam_s01_e06"},
	{ id: "MSUB19120716", saveName: "skam_s01_e07"},
	{ id: "MSUB19120816", saveName: "skam_s01_e08"},
	{ id: "MSUB19120916", saveName: "skam_s01_e09"},
	{ id: "MSUB19121016", saveName: "skam_s01_e10"},
	{ id: "MSUB19121116", saveName: "skam_s01_e11"},

	{ id: "MYNT15000116", saveName: "skam_s02_e01"},
	{ id: "MYNT15000216", saveName: "skam_s02_e02"},
	{ id: "MYNT15000316", saveName: "skam_s02_e03"},
	{ id: "MYNT15000416", saveName: "skam_s02_e04"},
	{ id: "MYNT15000516", saveName: "skam_s02_e05"},
	{ id: "MYNT15000616", saveName: "skam_s02_e06"},
	{ id: "MYNT15000716", saveName: "skam_s02_e07"},
	{ id: "MYNT15000816", saveName: "skam_s02_e08"},
	{ id: "MYNT15000916", saveName: "skam_s02_e09"},
	{ id: "MYNT15001116", saveName: "skam_s02_e01"},
	{ id: "MYNT15001216", saveName: "skam_s02_e11"},

	{ id: "MYNT15200116", saveName: "skam_s03_e01"},
	{ id: "MYNT15200216", saveName: "skam_s03_e02"},
	{ id: "MYNT15200316", saveName: "skam_s03_e03"},
	{ id: "MYNT15200416", saveName: "skam_s03_e04"},
	{ id: "MYNT15200516", saveName: "skam_s03_e05"},
	{ id: "MYNT15200616", saveName: "skam_s03_e06"},
	{ id: "MYNT15200716", saveName: "skam_s03_e07"},
	{ id: "MYNT15200816", saveName: "skam_s03_e08"},
	{ id: "MYNT15200916", saveName: "skam_s03_e09"},
	{ id: "MYNT15201016", saveName: "skam_s03_e10"},
	
	{ id: "MYNT15000117", saveName: "skam_s04_e01"},
	{ id: "MYNT15000217", saveName: "skam_s04_e02"},
	{ id: "MYNT15000317", saveName: "skam_s04_e03"},
]

getThenSave(skamEpisodes, '../../')

