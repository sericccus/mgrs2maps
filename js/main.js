import { isValidMGRS, addMGRSToList, list_of_mgrs } from './get_mgrs.js';
import { convertMgrs, convertMgrsToLatLon, convertLatLonToMgrs, formatMGRS } from './convert_mgrs.js';
import { displayTable } from './display_table.js';
import { createGoogleMapsLink, createRouteButton } from './create_route.js';
import { getPlaceNames } from './get_placeNames.js';
import { getUserLocation } from './getUserLocation.js';

let full_route = [];
let startingLocation = null;
let finalDestination = null;
let userLocationAdded = false;
let routeButtonsCreated = false;

// Validate the input and update the button state
function validateInput() {
    const input = document.getElementById('coords-input').value.trim();
    const addButton = document.getElementById('add-button');

    if (isValidMGRS(input)) {
        addButton.classList.remove('btn-danger');
        addButton.classList.add('btn-primary');
        addButton.innerText = 'Add';
        addButton.disabled = false;
    } else {
        addButton.classList.remove('btn-primary');
        addButton.classList.add('btn-danger');
        addButton.innerText = 'X';
        addButton.disabled = true;
    }
}

// Add coordinates to the table and update full_route
async function addCoords() {
    const input = document.getElementById('coords-input').value.trim();
    if (isValidMGRS(input)) {
        const latLon = convertMgrsToLatLon(input);
        const place = await getPlaceName(latLon.lat, latLon.lon);
        const location = {
            mgrs: formatMGRS(input),
            neCoordinate: latLon,
            place
        };

        if (!startingLocation) {
            startingLocation = location;
        }
        
        full_route.push(location); // Add new location to the full route
        finalDestination = location;

        updateTable();
        document.getElementById('coords-input').value = '';
        validateInput();

        if (!routeButtonsCreated) {
            createRouteButtons();
            routeButtonsCreated = true;
        }
    }
}

// Toggle the addition/removal of the current user location as the start location
async function toggleCurrentLocation() {
    const button = document.getElementById('add-current-location-button');
    if (userLocationAdded) {
        removeCurrentLocation();
        button.innerText = 'Von hier starten';
        button.classList.remove('btn-outline-danger');
        button.classList.add('btn-outline-info');
    } else {
        await addCurrentLocation();
        button.innerText = 'Nicht von hier starten';
        button.classList.remove('btn-outline-info');
        button.classList.add('btn-outline-danger');
    }
    userLocationAdded = !userLocationAdded;

    if (!routeButtonsCreated && full_route.length > 0) {
        createRouteButtons();
        routeButtonsCreated = true;
    }

    if (full_route.length < 2) {
        removeRouteButtons();
        routeButtonsCreated = false;
    }
}

// Add the current user location as the start location
async function addCurrentLocation() {
    try {
        const position = await getUserLocation();
        const mgrsCoord = convertLatLonToMgrs(position);
        const formattedMgrs = formatMGRS(mgrsCoord);
        const place = await getPlaceName(position.lat, position.lon);
        const location = {
            mgrs: formattedMgrs,
            neCoordinate: position,
            place
        };

        if (full_route.length > 0) {
            full_route.unshift(location);
        } else {
            full_route = [location];
        }

        startingLocation = location;


        updateTable();
    } catch (error) {
        console.error('Error getting user location:', error);
    }
}

// Remove the current user location from the start location
function removeCurrentLocation() {
    if (userLocationAdded && full_route.length > 0 && startingLocation) {
        full_route.shift(); // Remove the current location
        startingLocation = full_route.length > 0 ? full_route[0] : null;
        finalDestination = full_route.length >= 1 ? full_route[full_route.length - 1] : null;
        updateTable();
    }
}

// Update the table with the current route
function updateTable() {
    let waypoints = [];
    if (full_route.length > 2) {
        waypoints = full_route.slice(1, -1);
    }

    if (full_route.length === 1) {
        startingLocation = full_route[0];
        finalDestination = '';
    } else {
        startingLocation = full_route[0];
        finalDestination = full_route[full_route.length - 1];
    }

    console.log("Updating table with:", { startingLocation, finalDestination, waypoints });
    displayTable(startingLocation, finalDestination, waypoints);
}

// Create the generate route buttons
function createRouteButtons() {
    const buttonContainerTop = document.getElementById('button-container-top');
    const buttonContainerBottom = document.getElementById('button-container-bottom');

    const generateButtonTop = document.createElement('button');
    generateButtonTop.id = 'generate-route-button-top';
    generateButtonTop.classList.add('btn', 'btn-success', 'mb-3');
    generateButtonTop.innerText = 'Route generieren';
    generateButtonTop.onclick = generateRoute;

    const generateButtonBottom = document.createElement('button');
    generateButtonBottom.id = 'generate-route-button-bottom';
    generateButtonBottom.classList.add('btn', 'btn-success', 'mb-3');
    generateButtonBottom.innerText = 'Route generieren';
    generateButtonBottom.onclick = generateRoute;

    buttonContainerTop.appendChild(generateButtonTop);
    buttonContainerBottom.appendChild(generateButtonBottom);
}

// Remove the generate route buttons
function removeRouteButtons() {
    const buttonContainerTop = document.getElementById('button-container-top');
    const buttonContainerBottom = document.getElementById('button-container-bottom');
    const buttonContainerMapsTop = document.getElementById('button-container-maps-top');
    const buttonContainerMapsBottom = document.getElementById('button-container-maps-bottom');
    
    buttonContainerTop.innerHTML = '';
    buttonContainerBottom.innerHTML = '';
    buttonContainerMapsTop.innerHTML = '';
    buttonContainerMapsBottom.innerHTML = '';
}

// Generate the route and create the Google Maps link
function generateRoute() {
    if (startingLocation && finalDestination) {
        const routeUrl = createGoogleMapsLink(startingLocation, finalDestination, full_route.slice(1, -1));
        createRouteButton(routeUrl, 'button-container-maps-top');
        createRouteButton(routeUrl, 'button-container-maps-bottom');
        console.log("Route URL created:", routeUrl);
    }
}

// Function to reverse geocode coordinates using OpenStreetMap Nominatim API
async function getPlaceName(lat, lon) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await response.json();
    return data.display_name;
}

document.getElementById('coords-input').addEventListener('input', validateInput);

window.addCoords = addCoords;
window.toggleCurrentLocation = toggleCurrentLocation;
window.generateRoute = generateRoute;
