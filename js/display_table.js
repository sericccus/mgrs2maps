import { formatMGRS } from './convert_mgrs.js';

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

    // Format Place
    let placeCell = row.insertCell(1);
    placeCell.innerHTML = formatPlace(place);
}

// Function to format place for display
function formatPlace(place) {
    const parts = place.split(', ');
    const lastLine = parts.splice(-3).join(', ');
    return `${parts.join(', ')}<br>${lastLine}`;
}

export { displayTable };
