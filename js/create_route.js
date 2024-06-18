// Function to create a Google Maps link that opens in the mobile browser
function createGoogleMapsLink(startingLocation, finalDestination, waypoints) {
    const base_url = "https://maps.google.com/maps/dir/";
    const origin = startingLocation ? `${startingLocation.neCoordinate.lat},${startingLocation.neCoordinate.lon}` : '';
    const destination = finalDestination ? `${finalDestination.neCoordinate.lat},${finalDestination.neCoordinate.lon}` : '';
    const waypointsParam = waypoints.length > 0 ? waypoints.map(wp => `${wp.neCoordinate.lat},${wp.neCoordinate.lon}`).join('/') : '';
    const travelmode = "/data=!3m1!4b1"; // Example additional parameters

    let fullUrl;
    if (waypointsParam) {
        fullUrl = `${base_url}${origin}/${waypointsParam}/${destination}${travelmode}`;
    } else {
        fullUrl = `${base_url}${origin}/${destination}${travelmode}`;
    }

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
    button.textContent = "Open in Google Maps";
    resultDiv.appendChild(button);
}

export { createGoogleMapsLink, createRouteButton };
