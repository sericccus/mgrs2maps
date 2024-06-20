let list_of_mgrs = [];

// Add an event listener to the input field to validate input in real-time
document.getElementById('coords-input').addEventListener('input', validateInput);

// Function to validate MGRS input and update the button state
function validateInput() {
    const input = document.getElementById('coords-input').value.trim();
    const addButton = document.getElementById('add-button');

    if (isValidMGRS(input)) {
        addButton.classList.remove('btn-danger');
        addButton.classList.add('btn-primary');
        addButton.innerText = 'Add';
        addButton.disabled = false;
    } else {
        addButton.classList.remove('btn-primary');
        addButton.classList.add('btn-danger');
        addButton.innerText = 'X';
        addButton.disabled = true;
    }
}

// Function to validate MGRS coordinates
function isValidMGRS(mgrsStr) {
    try {
        window.mgrs.toPoint(mgrsStr.replace(/\s+/g, '')); // Ensure spaces are removed
        return true;
    } catch (e) {
        return false;
    }
}

// Function to add MGRS to the list
function addMGRSToList(mgrsStr) {
    list_of_mgrs.push(mgrsStr);
}

export { isValidMGRS, addMGRSToList, list_of_mgrs };
