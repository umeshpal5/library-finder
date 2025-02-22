document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([26.9124, 75.7873], 13); // Default: Jaipur, Rajasthan

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLat = position.coords.latitude;
            var userLng = position.coords.longitude;

            // Add user location marker
            L.marker([userLat, userLng]).addTo(map)
                .bindPopup("You are here").openPopup();

            // Center map on user location
            map.setView([userLat, userLng], 14);
        });
    }

    // Sample library locations
    var libraries = [
        { name: "Central Library", lat: 26.9124, lng: 75.7873 },
        { name: "West End Library", lat: 26.9122, lng: 75.7890 },
        { name: "East Side Library", lat: 26.9118, lng: 75.7850 }
    ];

    // Add markers for libraries
    libraries.forEach(library => {
        L.marker([library.lat, library.lng]).addTo(map)
            .bindPopup(`<b>${library.name}</b>`);
    });

    // Search function
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
                div.innerHTML = `<h3>${lib.name}</h3>`;
                libraryList.appendChild(div);
            });
        }
    };
});