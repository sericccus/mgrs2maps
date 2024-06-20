// get_placeNames.js
// Function to reverse geocode coordinates using OpenStreetMap Nominatim API
async function getPlaceNames({ startingLocation, finalDestination, list_of_waypoints }) {
    const reverseGeocode = async (lat, lon) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        return data.display_name;
    };

    if (startingLocation) {
        startingLocation.place = await reverseGeocode(startingLocation.neCoordinate.lat, startingLocation.neCoordinate.lon);
    }
    if (finalDestination) {
        finalDestination.place = await reverseGeocode(finalDestination.neCoordinate.lat, finalDestination.neCoordinate.lon);
    }
    for (let waypoint of list_of_waypoints) {
        waypoint.place = await reverseGeocode(waypoint.neCoordinate.lat, waypoint.neCoordinate.lon);
    }

    return { startingLocation, finalDestination, list_of_waypoints };
}

export { getPlaceNames };
