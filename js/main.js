import { processMgrs } from './get_mgrs.js';
import { convertMgrs } from './convert_mgrs.js';
import { displayTable } from './display_table.js';
import { createGoogleMapsLink, createRouteButton } from './create_route.js';
import { getPlaceNames } from './get_placeNames.js';

async function submitCoords() {
    const { startingLocation, finalDestination, list_of_waypoints } = await convertMgrs(await processMgrs());
    const { startingLocation: start, finalDestination: end, list_of_waypoints: waypoints } = await getPlaceNames({ startingLocation, finalDestination, list_of_waypoints });
    displayTable(start, end, waypoints);

    if (start && end) {
        const routeUrl = createGoogleMapsLink(start, end, Object.values(waypoints));
        createRouteButton(routeUrl);
        console.log("Route URL created:", routeUrl);
    }
}

window.submitCoords = submitCoords; // Expose to global scope
