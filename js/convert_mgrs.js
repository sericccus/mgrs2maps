import * as mgrs from './mgrs.min.js';

// Function to convert MGRS to LatLon using the MGRS library
function convertMgrsToLatLon(mgrsString) {
    try {
        const [lon, lat] = window.mgrs.toPoint(mgrsString.replace(/\s+/g, ''));
        return { lat, lon };
    } catch (error) {
        console.error('Error converting MGRS to coordinates:', error);
        return null;
    }
}

// Function to convert LatLon to MGRS (for user location conversion)
function convertLatLonToMgrs(latLon) {
    try {
        return window.mgrs.forward([latLon.lon, latLon.lat]);
    } catch (error) {
        console.error('Error converting LatLon to MGRS:', error);
        return null;
    }
}

// Function to convert MGRS coordinates and create a list of waypoints
function convertMgrs(mgrs_coords) {
    const LatLon_coords = mgrs_coords.map(mgrs => convertMgrsToLatLon(mgrs));
    console.log("LatLon Coordinates:", LatLon_coords);

    const full_route = [];
    let startingLocation = null;
    let finalDestination = null;

    for (let i = 0; i < LatLon_coords.length; i++) {
        const coords = LatLon_coords[i];
        const location = {
            mgrs: formatMGRS(mgrs_coords[i]), // Apply formatting here
            neCoordinate: coords
        };
        full_route.push(location);
        console.log(`Location ${i + 1}`, location);
    }

    if (LatLon_coords.length > 0) {
        startingLocation = full_route[0];
        finalDestination = full_route[full_route.length - 1];
    }

    return { startingLocation, finalDestination, full_route };
}

// Function to format MGRS coordinates for display
function formatMGRS(mgrs) {
    return mgrs.replace(/^(\d{1,2}[C-X])([A-HJ-NP-Z]{2})(\d{5})(\d{5})$/, '$1 $2 $3 $4');
}

export { convertMgrs, convertMgrsToLatLon, convertLatLonToMgrs };
