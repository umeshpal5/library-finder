document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([26.9124, 75.7873], 13); // Default: Jaipur, Rajasthan

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let userMarker;

    // Get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLat = position.coords.latitude;
            var userLng = position.coords.longitude;

            userMarker = L.marker([userLat, userLng]).addTo(map)
                .bindPopup("You are here").openPopup();

            map.setView([userLat, userLng], 14);
        });
    }

    // Sample library locations
    var libraries = [
        { name: "Central Library", lat: 26.9124, lng: 75.7873 },
        { name: "West End Library", lat: 26.9122, lng: 75.7890 },
        { name: "East Side Library", lat: 26.9118, lng: 75.7850 },
        { name: "Rajasthan State Library", lat: 26.9150, lng: 75.7800 }
    ];

    function getDirectionsLink(lat, lng) {
        return `<a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank">
                    <button class="directions-btn">Get Directions</button>
                </a>`;
    }

    function loadLibraries() {
        libraries.forEach(library => {
            L.marker([library.lat, library.lng]).addTo(map)
                .bindPopup(`<b>${library.name}</b><br>${getDirectionsLink(library.lat, library.lng)}`);
        });
    }

    loadLibraries();

    window.searchLibrary = function () {
        let query = document.getElementById('searchBox').value.trim().toLowerCase();
        let libraryList = document.getElementById('libraryList');
        libraryList.innerHTML = '';

        let results = libraries.filter(lib => lib.name.toLowerCase().includes(query));

        if (results.length === 0) {
            libraryList.innerHTML = '<p>No libraries found.</p>';
        } else {
            results.forEach(lib => {
                let div = document.createElement('div');
                div.classList.add('library-item');
                div.innerHTML = `<h3>${lib.name}</h3>${getDirectionsLink(lib.lat, lib.lng)}`;
                libraryList.appendChild(div);
            });
        }
    };

    // Super Admin Authentication (Example Password: "admin123")
    let isSuperAdmin = false;
    let adminPassword = prompt("Enter Super Admin Password (Leave blank if you are a user):");

    if (adminPassword === "admin123") {
        isSuperAdmin = true;
        document.getElementById('adminPanel').style.display = 'block';
    }

    window.addLibrary = function () {
        if (!isSuperAdmin) {
            alert("Only the Super Admin can add libraries!");
            return;
        }

        let name = document.getElementById('libraryName').value.trim();
        let lat = parseFloat(document.getElementById('libraryLat').value.trim());
        let lng = parseFloat(document.getElementById('libraryLng').value.trim());

        if (!name || isNaN(lat) || isNaN(lng)) {
            alert("Please enter valid details!");
            return;
        }

        libraries.push({ name, lat, lng });

        L.marker([lat, lng]).addTo(map)
            .bindPopup(`<b>${name}</b><br>${getDirectionsLink(lat, lng)}`);

        document.getElementById('libraryName').value = "";
        document.getElementById('libraryLat').value = "";
        document.getElementById('libraryLng').value = "";
    };
});