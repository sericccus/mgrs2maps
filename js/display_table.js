function displayTable(startingLocation, finalDestination, list_of_waypoints) {
    const resultsTable = document.getElementById('resultsTable');
    const tableBody = resultsTable.getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear previous entries

    let index = 1;

    if (startingLocation) {
        addTableRow(tableBody, 'Start', formatMGRS(startingLocation.mgrs), formatLatLon(startingLocation.neCoordinate), formatPlace(startingLocation.place));
    }

    for (const [key, data] of Object.entries(list_of_waypoints)) {
        addTableRow(tableBody, index++, formatMGRS(data.mgrs), formatLatLon(data.neCoordinate), formatPlace(data.place));
    }

    if (finalDestination) {
        addTableRow(tableBody, 'End', formatMGRS(finalDestination.mgrs), formatLatLon(finalDestination.neCoordinate), formatPlace(finalDestination.place));
    }

    resultsTable.style.display = 'table';
}

// Adds a row to the specified table
function addTableRow(tableBody, label, mgrs, latLon, place) {
    let row = tableBody.insertRow();
    row.insertCell(0).textContent = label;

    // MGRS coordinates split into two lines
    let mgrsCell = row.insertCell(1);
    mgrsCell.innerHTML = mgrs;

    // Lat/Lon coordinates split into two lines
    let latLonCell = row.insertCell(2);
    latLonCell.innerHTML = latLon;

    // Place name split into two lines
    let placeCell = row.insertCell(3);
    placeCell.innerHTML = place;

    console.log("Added row:", { label, mgrs, latLon, place });
}

// Format MGRS coordinates to be split into two lines
function formatMGRS(mgrs) {
    const regex = /^(\d{1,2}[C-X][A-HJ-NP-Z]{2})(\d{5})(\d{5})$/;
    const match = mgrs.match(regex);
    if (match) {
        return `${match[1]}<br>${match[2]} ${match[3]}`;
    }
    return mgrs; // Return as is if it doesn't match the expected format
}

// Format Lat/Lon coordinates to be split into two lines
function formatLatLon(neCoordinate) {
    return `${neCoordinate.lat}<br>${neCoordinate.lon}`;
}

// Format place into two lines: line 1 (place name, street), line 2 (zip code, city, country)
function formatPlace(place) {
    // Assuming the place string is already cleaned and separated by newline characters
    const lines = place.split('\n');
    if (lines.length > 1) {
        return `${lines[0]}<br>${lines.slice(1).join(', ')}`;
    }
    return place; // Return as is if it doesn't have enough lines
}

export { displayTable };
