async function submitCoords() {
    console.log("Starting coordinate submission process.");
    const useCurrentLocation = document.getElementById('useCurrentLocation').checked;
    const isSecureOrigin = location.protocol === 'https:' || location.hostname === 'localhost';

    if (useCurrentLocation && isSecureOrigin && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const currentLocation = `${latitude},${longitude}`;
            console.log("Current location obtained:", currentLocation);
            await processCoordinates(currentLocation);
        }, async (error) => {
            alert('Error obtaining location: ' + error.message);
            console.error('Geolocation error:', error);
            await processCoordinates(null);
        });
    } else if (useCurrentLocation) {
        alert('Geolocation is not supported by your browser or not running in a secure context.');
        console.warn('Geolocation is disabled in non-secure contexts.');
        const defaultLocation = '51.5074,-0.1278'; // Example: London coordinates
        await processCoordinates(defaultLocation);
    } else {
        await processCoordinates(null);
    }
}

async function processCoordinates(currentLocation) {
    const input = document.getElementById('coords-input').value;
    const lines = input.toUpperCase().split('\n').filter(line => line.trim());
    const destinations = lines.map(line => line.replace(/\s+/g, '')).filter(line => isValidMGRS(line));

    if (destinations.length !== lines.length) {
        alert("One or more MGRS codes were invalid and have been ignored.");
    }

    const convertedDestinations = await updateResultsTable(destinations, currentLocation);

    const lastDestination = convertedDestinations[convertedDestinations.length - 1];
    const lastDestinationAddress = lastDestination ? await reverseGeocode(`${lastDestination.lat},${lastDestination.lon}`) : "Unknown location";
    const startLocationAddress = currentLocation ? await reverseGeocode(currentLocation) : "Unknown location";

    const headlineText = currentLocation ? `From ${startLocationAddress} to ${lastDestinationAddress}` : `To ${lastDestinationAddress}`;
    updateHeadline(headlineText);

    if (convertedDestinations.length > 0) {
        const routeUrl = createGoogleMapsLink(currentLocation, convertedDestinations);
        createRouteButton(routeUrl);
        console.log("Route URL created:", routeUrl);
    }
}

function isValidMGRS(mgrs) {
    const regex = /^[0-9]{1,2}[C-X][A-HJ-NP-Z]{2}\s*\d{1,5}\s*\d{1,5}$/i;
    return regex.test(mgrs);
}

function createGoogleMapsLink(currentLocation, convertedDestinations) {
    const base_url = "https://www.google.com/maps/dir/?api=1&travelmode=driving";
    const origin = currentLocation ? `&origin=${currentLocation}` : '';
    const destinations = convertedDestinations.map(dest => `${dest.lat},${dest.lon}`).join('|');
    const destination = `&destination=${convertedDestinations[convertedDestinations.length - 1].lat},${convertedDestinations[convertedDestinations.length - 1].lon}`;
    const waypoints = convertedDestinations.length > 1 ? `&waypoints=${destinations}` : '';
    const fullUrl = base_url + origin + destination + waypoints;
    console.log("Generated Google Maps URL:", fullUrl);
    return fullUrl;
}

function createRouteButton(url) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    const button = document.createElement('a');
    button.href = url;
    button.target = "_blank";
    button.className = "btn btn-success";
    button.style.width = "100%";
    button.textContent = "zu Google";
    resultDiv.appendChild(button);
}

async function updateResultsTable(destinations, currentLocation) {
    console.log("Updating results table with converted MGRS coordinates and place names.");
    const tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear previous entries
    const convertedDestinations = [];

    if (currentLocation) {
        const currentPlaceName = await reverseGeocode(currentLocation);
        addTableRow(tableBody, "Current Location", currentLocation, currentPlaceName);
    }

    for (const dest of destinations) {
        const latlon = convertMgrsToLatLon(dest);
        if (latlon) {
            convertedDestinations.push(latlon);
            const placeName = await reverseGeocode(`${latlon.lat},${latlon.lon}`);
            addTableRow(tableBody, formatMGRS(dest), `${latlon.lat} ${latlon.lon}`, cleanAddress(placeName) || 'Name not available');
        } else {
            console.error("Invalid conversion for:", dest);
        }
    }

    console.log("Finished updating results table.");
    return convertedDestinations;
}

function addTableRow(tableBody, label, coords, placeName) {
    let row = tableBody.insertRow();
    row.insertCell(0).textContent = label;

    // Format coordinates as "N: {latitude}\nE: {longitude}"
    const formattedCoords = coords.replace(/(\d{5})(\d{5})/, '$1 $2');
    row.insertCell(1).textContent = formattedCoords;

    row.insertCell(2).innerHTML = placeName;
    console.log("Added row:", { label, coords: formattedCoords, placeName });
}

async function reverseGeocode(coords) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords}&key=AIzaSyBbvkdgwdv3kRAA4Q3jy5r52M5sR6-OUg4`);
    const data = await response.json();
    return data.results[0]?.formatted_address || "Unknown location";
}

function convertMgrsToLatLon(mgrsString) {
    try {
        const [lon, lat] = window.mgrs.toPoint(mgrsString);
        return { lat, lon };
    } catch (error) {
        console.error('Error converting MGRS to coordinates:', error);
        return null;
    }
}

function updateHeadline(text) {
    const headlineDiv = document.getElementById('headline');
    headlineDiv.textContent = text;
}

function formatMGRS(mgrs) {
    return mgrs.replace(/^(\d{1,2}[C-X])([A-HJ-NP-Z]{2})(\d{1,5})(\d{1,5})$/, '$1 $2 $3 $4');
}

function cleanAddress(address) {
    const cleaned = address.replace(/[\d\w]{2,}\+[\d\w]{2,}/g, '').trim();
    return cleaned.replace(/, /g, '\n');
}
