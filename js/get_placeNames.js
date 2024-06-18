// Reverse geocode coordinates using the Google Maps API
async function reverseGeocode(coords) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lon}&key=AIzaSyBbvkdgwdv3kRAA4Q3jy5r52M5sR6-OUg4`);
    const data = await response.json();
    return data.results[0]?.formatted_address || "Unknown location";
}

// Function to clean address
function cleanAddress(address) {
    const cleaned = address.replace(/[\d\w]{2,}\+[\d\w]{2,}/g, '').trim();
    return cleaned.replace(/, /g, '\n');
}

// Function to get place names for the waypoints, start location, and final destination
async function getPlaceNames({ startingLocation, finalDestination, list_of_waypoints }) {
    if (startingLocation) {
        startingLocation.place = cleanAddress(await reverseGeocode(startingLocation.neCoordinate));
    }

    if (finalDestination) {
        finalDestination.place = cleanAddress(await reverseGeocode(finalDestination.neCoordinate));
    }

    for (const key in list_of_waypoints) {
        const waypoint = list_of_waypoints[key];
        waypoint.place = cleanAddress(await reverseGeocode(waypoint.neCoordinate));
    }

    return { startingLocation, finalDestination, list_of_waypoints };
}

export { getPlaceNames };
