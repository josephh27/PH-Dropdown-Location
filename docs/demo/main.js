const regionSelection = document.querySelector(".region");
const provinceSelection = document.querySelector("#province");
const municipalitySelection = document.querySelector("#municipality");
const barangaySelection = document.querySelector("#barangay");

async function findBarangay(municipalityCode) {
    const response = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${municipalityCode}/barangays.json`);
    const barangays = await response.json();
    removeOptions(barangaySelection);
    for (let i = 0; i < barangays.length; i++) {
        let newOpt = document.createElement('option');
        newOpt.textContent = barangays[i]['name'];
        newOpt.code = barangays[i]['code'];
        newOpt.value = barangays[i]['name'];
        barangaySelection.appendChild(newOpt);
    }
}

async function findMunicipality(provinceCode) {
	const response = await fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/municipalities.json`);
	const municipalities = await response.json();
	removeOptions(municipalitySelection);
	for (let i = 0; i < municipalities.length; i++) {
		let newOpt = document.createElement('option');
		newOpt.textContent = municipalities[i]['name'];
		newOpt.code = municipalities[i]['code'];
		newOpt.value = municipalities[i]['name'];
		municipalitySelection.appendChild(newOpt);
	}	
	for (let i = 0; i < municipalities.length; i++) {
		if (municipalities[i]['name'] === municipalitySelection.value) {
			findBarangay(municipalities[i]['code'])
		}
	}
	municipalitySelection.addEventListener('change', () => findBarangay(municipalitySelection[municipalitySelection.selectedIndex].code));
}

async function findProvince(regionCode) {
	const response = await fetch(`https://psgc.gitlab.io/api/regions/${regionCode}/provinces.json`);
	const provinces = await response.json();
	removeOptions(provinceSelection);
	console.log(regionCode);
	for (let i = 0; i < provinces.length; i++) {
		let newOpt = document.createElement('option');
		newOpt.textContent = provinces[i]['name'];
		newOpt.code = provinces[i]['code'];
		newOpt.value = provinces[i]['name'];
		provinceSelection.appendChild(newOpt);
	}	
	for (let i = 0; i < provinces.length; i++) {
		if (provinces[i]['name'] === provinceSelection.value) {
			findMunicipality(provinces[i]['code'])
		}
	}
	
	provinceSelection.addEventListener('change', () => findMunicipality(provinceSelection[provinceSelection.selectedIndex].code));
}

async function generateRegions() {
	const response = await fetch(`https://psgc.gitlab.io/api/regions.json`);
	const regions = await response.json();
	for (let i = 0; i < regions.length; i++) {
		let newOpt = document.createElement('option');
		let clone = newOpt.cloneNode(true);
		newOpt.textContent = regions[i]['name'];
		newOpt.code = regions[i]['code'];
		newOpt.value = regions[i]['name'];
		clone.textContent = regions[i]['name'];
		clone.code = regions[i]['code'];
		clone.value = regions[i]['name'];
		regionSelection.appendChild(newOpt);
	}	
	for (let i = 0; i < regions.length; i++) {
		if (regions[i]['name'] === regionSelection.value) {
			findProvince(regions[i]['code'])
		}
	}
}
generateRegions()

regionSelection.addEventListener('change', () => findProvince(regionSelection[regionSelection.selectedIndex].code));

function removeOptions(selection) {
	if (selection.options) {
		var i, L = selection.options.length - 1;
		for(i = L; i >= 0; i--) {
		   selection.remove(i);
		}
	}
 }