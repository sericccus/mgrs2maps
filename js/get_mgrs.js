import { convertLatLonToMgrs } from './convert_mgrs.js';

// Function to get MGRS coordinates from the text area
function getMgrsCoords() {
    const textarea = document.getElementById('coords-input');
    const input = textarea.value.toUpperCase().split('\n').map(line => line.trim().replace(/\s+/g, ' ')).filter(line => line !== '');
    const mgrs_coords = [];
    textarea.value = '';

    input.forEach(line => {
        if (isValidMGRS(line)) {
            mgrs_coords.push(line);
            textarea.value += line + '\n';
        } else {
            console.log(`Invalid MGRS: ${line}`);
            textarea.value += `Invalid: ${line}\n`;
        }
    });

    console.log("MGRS Coordinates:", mgrs_coords);
    return mgrs_coords;
}

// Function to validate MGRS coordinates
function isValidMGRS(mgrs) {
    try {
        window.mgrs.toPoint(mgrs);
        return true;
    } catch (e) {
        return false;
    }
}

// Function to get the current user location
async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const usrLocation = { lat: position.coords.latitude, lon: position.coords.longitude };
                console.log("User Location:", usrLocation);
                resolve(usrLocation);
            }, error => {
                console.error('Geolocation error:', error);
                reject(error);
            });
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

// Function to handle the checkbox state and user location
async function handleCheckboxState(mgrs_coords) {
    const checkbox = document.getElementById('useCurrentLocation');
    if (checkbox.checked) {
        try {
            const usrLocation = await getUserLocation();
            const usrLocationMgrs = convertLatLonToMgrs(usrLocation);
            mgrs_coords.unshift(usrLocationMgrs);
            console.log("User Location added:", usrLocationMgrs);
        } catch (error) {
            console.error("Could not get user location:", error);
        }
    }
    return mgrs_coords;
}

// Function to get and process MGRS coordinates
async function processMgrs() {
    let mgrs_coords = getMgrsCoords();
    mgrs_coords = await handleCheckboxState(mgrs_coords);
    mgrs_coords = [...new Set(mgrs_coords)]; // Remove duplicates
    console.log("Processed MGRS Coordinates:", mgrs_coords);
    return mgrs_coords;
}

export { processMgrs };
