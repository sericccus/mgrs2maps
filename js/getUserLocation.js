// getUserLocation.js
// Get user location using geolocation API
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                resolve({ lat: position.coords.latitude, lon: position.coords.longitude });
            }, error => {
                reject(error);
            });
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

export { getUserLocation };
