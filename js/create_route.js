// Function to create a Google Maps link for the route
function createGoogleMapsLink(start, end, waypoints) {
    let url = `https://www.google.com/maps/dir/?api=1&origin=${start.neCoordinate.lat},${start.neCoordinate.lon}&destination=${end.neCoordinate.lat},${end.neCoordinate.lon}&travelmode=driving`;
    
    if (waypoints.length > 0) {
        const waypointStr = waypoints.map(wp => `${wp.neCoordinate.lat},${wp.neCoordinate.lon}`).join('|');
        url += `&waypoints=${encodeURIComponent(waypointStr)}`;
    }
    
    return url;
}

// Function to create a button for the Google Maps link
function createRouteButton(routeUrl, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous buttons

    const button = document.createElement('a');
    button.href = routeUrl;
    button.target = '_blank';
    button.classList.add('btn', 'btn-primary');
    button.innerText = 'In Google Maps öffnen';

    container.appendChild(button);
}

export { createGoogleMapsLink, createRouteButton };
