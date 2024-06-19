// Function to display the table with route information
function displayTable(startingLocation, finalDestination, list_of_waypoints) {
    const resultsTable = document.getElementById('resultsTable');
    const tableBody = resultsTable.getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear previous entries

    let index = 1;

    if (startingLocation) {
        addTableRow(tableBody, 'Start', startingLocation.mgrs, startingLocation.neCoordinate.lat, startingLocation.neCoordinate.lon, startingLocation.place);
    }

    for (const waypoint of list_of_waypoints) {
        addTableRow(tableBody, index++, waypoint.mgrs, waypoint.neCoordinate.lat, waypoint.neCoordinate.lon, waypoint.place);
    }

    if (finalDestination) {
        addTableRow(tableBody, 'End', finalDestination.mgrs, finalDestination.neCoordinate.lat, finalDestination.neCoordinate.lon, finalDestination.place);
    }

    resultsTable.style.display = 'table';
}

// Helper function to add a row to the table
function addTableRow(tableBody, label, mgrs, lat, lon, place) {
    let row = tableBody.insertRow();
    row.insertCell(0).textContent = label;

    // Format MGRS
    let formattedMgrs = formatMGRS(mgrs);
    let mgrsCell = row.insertCell(1);
    mgrsCell.innerHTML = formattedMgrs.replace(/\s/g, '<br>');

    // Format Lat/Lon
    let latLonCell = row.insertCell(2);
    latLonCell.innerHTML = `${lat.toFixed(5)}<br>${lon.toFixed(5)}`;

    // Format Place
    let placeCell = row.insertCell(3);
    placeCell.innerHTML = formatPlace(place);
}

// Function to format MGRS coordinates for display
function formatMGRS(mgrs) {
    return mgrs.replace(/^(\d{1,2}[C-X])([A-HJ-NP-Z]{2})(\d{5})(\d{5})$/, '$1 $2 $3 $4');
}

// Function to format place for display
function formatPlace(place) {
    const parts = place.split(', ');
    const lastLine = parts.splice(-3).join(', ');
    return `${parts.join(', ')}<br>${lastLine}`;
}

export { displayTable };
