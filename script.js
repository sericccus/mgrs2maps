// Function to handle the submission of coordinates
async function submitCoords() {
    console.log("Starting coordinate submission process.");
    const isSecureOrigin = location.protocol === 'https:' || location.hostname === 'localhost';

    if (isSecureOrigin && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const currentLocation = `${latitude},${longitude}`;
            console.log("Current location obtained:", currentLocation);
            processCoordinates(currentLocation);
        }, (error) => {
            alert('Error obtaining location: ' + error.message);
            console.error('Geolocation error:', error);
        });
    } else {
        alert('Geolocation is not supported by your browser or not running in a secure context.');
        console.warn('Geolocation is disabled in non-secure contexts.');
        const defaultLocation = '51.5074,-0.1278'; // Example: London coordinates
        processCoordinates(defaultLocation);
    }
}

// Process coordinates input
async function processCoordinates(currentLocation) {
    const input = document.getElementById('coords-input').value;

    // Splitting the input into lines, processing each line, and validating MGRS format
    const lines = input.toUpperCase().split('\n').filter(line => line.trim());
    const destinations = lines.map(line => line.replace(/\s+/g, '')).filter(line => isValidMGRS(line));

    if (destinations.length !== lines.length) {
        alert("One or more MGRS codes were invalid and have been ignored.");
    }

    updateHeadline('From Your Location to Destination');

    const convertedDestinations = await updateResultsTable(destinations, currentLocation);
    if (convertedDestinations.length > 0) {
        const routeUrl = createGoogleMapsLink(currentLocation, convertedDestinations);
        createRouteButton(routeUrl);
        console.log("Route URL created:", routeUrl);
    }
}

// Validates MGRS codes using a basic regex pattern
function isValidMGRS(mgrs) {
    const regex = /^[0-9]{1,2}[C-X][A-HJ-NP-Z]{2}\s*\d{1,5}\s*\d{1,5}$/i;
    return regex.test(mgrs);
}

// Creates a Google Maps link using validated coordinates
function createGoogleMapsLink(currentLocation, convertedDestinations) {
    const base_url = "https://www.google.com/maps/dir/";
    const routeParts = [currentLocation, ...convertedDestinations.map(dest => `${dest.lat},${dest.lon}`)];
    const fullUrl = base_url + routeParts.join('/') + "&travelmode=driving";
    console.log("Generated Google Maps URL:", fullUrl);
    return fullUrl;
}

// Creates a button to view the route on Google Maps
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

// Updates the results table with converted MGRS coordinates and place names
async function updateResultsTable(destinations, currentLocation) {
    console.log("Updating results table with converted MGRS coordinates and place names.");
    const tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear previous entries
    const convertedDestinations = [];

    const currentPlaceName = await reverseGeocode(currentLocation);
    addTableRow(tableBody, "Current Location", currentLocation, currentPlaceName);

    for (const dest of destinations) {
        const latlon = convertMgrsToLatLon(dest);
        if (latlon) {
            convertedDestinations.push(latlon);
            const placeName = await reverseGeocode(`${latlon.lat},${latlon.lon}`);
            addTableRow(tableBody, dest, `${latlon.lat},${latlon.lon}`, placeName || 'Name not available');
        } else {
            console.error("Invalid conversion for:", dest);
        }
    }

    console.log("Finished updating results table.");
    return convertedDestinations;
}

// Adds a row to the specified table
function addTableRow(tableBody, label, coords, placeName) {
    let row = tableBody.insertRow();
    row.insertCell(0).textContent = label;
    
    // Format coordinates as "N: {latitude}\nE: {longitude}"
    const [lat, lon] = coords.split(',');
    row.insertCell(1).innerHTML = `N: ${lat}<br>E: ${lon}`;
    
    row.insertCell(2).textContent = placeName;
    console.log("Added row:", { label, coords, placeName });
}

// Reverse geocodes coordinates using the Google Maps API
async function reverseGeocode(coords) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords}&key=YOUR_RESTRICTED_API_KEY`);
    const data = await response.json();
    return data.results[0]?.formatted_address || "Unknown location";
}

// Converts MGRS coordinates to latitude and longitude using the MGRS library
function convertMgrsToLatLon(mgrsString) {
    try {
        const [lon, lat] = window.mgrs.toPoint(mgrsString);
        return { lat, lon };
    } catch (error) {
        console.error('Error converting MGRS to coordinates:', error);
        return null;
    }
}

// Updates the headline based on the route details
function updateHeadline(text) {
    const headlineDiv = document.getElementById('headline');
    headlineDiv.textContent = text;
}
