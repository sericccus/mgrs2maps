// Convert MGRS to LatLon using the MGRS library
function convertMgrsToLatLon(mgrsString) {
    try {
        const [lon, lat] = window.mgrs.toPoint(mgrsString);
        return { lat, lon };
    } catch (error) {
        console.error('Error converting MGRS to coordinates:', error);
        return null;
    }
}

// Convert LatLon to MGRS (for user location conversion)
function convertLatLonToMgrs(latLon) {
    try {
        return window.mgrs.forward([latLon.lon, latLon.lat]);
    } catch (error) {
        console.error('Error converting LatLon to MGRS:', error);
        return null;
    }
}

// Convert MGRS coordinates and create waypoints list
function convertMgrs(mgrs_coords) {
    const LatLon_coords = mgrs_coords.map(mgrs => convertMgrsToLatLon(mgrs));
    console.log("LatLon Coordinates:", LatLon_coords);

    const list_of_waypoints = {};
    let startingLocation = null;
    let finalDestination = null;

    for (let i = 0; i < LatLon_coords.length; i++) {
        const coords = LatLon_coords[i];
        const locationKey = `location_${i + 1}`;
        list_of_waypoints[locationKey] = {
            mgrs: formatMGRS(mgrs_coords[i]), // Apply formatting here
            neCoordinate: coords
        };
        console.log(locationKey, list_of_waypoints[locationKey]);
    }

    if (LatLon_coords.length > 0) {
        startingLocation = list_of_waypoints['location_1'];
        finalDestination = list_of_waypoints[`location_${LatLon_coords.length}`];
        delete list_of_waypoints['location_1'];
        delete list_of_waypoints[`location_${LatLon_coords.length}`];
    }

    return { startingLocation, finalDestination, list_of_waypoints };
}

// Function to format MGRS coordinates
function formatMGRS(mgrs) {
    return mgrs.replace(/^(\d{1,2}[C-X])([A-HJ-NP-Z]{2})(\d{5})(\d{5})$/, '$1 $2 $3 $4');
}

export { convertMgrs, convertMgrsToLatLon, convertLatLonToMgrs };
