window.onload = function() {
    // Initialize the map centered in India
    var map = L.map('map').setView([20.5937, 78.9629], 5); 

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Store user location
    let userLat, userLon;

    // Show user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLat = position.coords.latitude;
            userLon = position.coords.longitude;

            // Update map view to user's location
            map.setView([userLat, userLon], 12);

            // Add marker for user's location
            L.marker([userLat, userLon], {
                icon: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/32/149/149060.png', iconSize: [30, 30] })
            }).addTo(map).bindPopup("<b>You are here</b>").openPopup();
        }, () => {
            console.log("Geolocation permission denied. Using default location.");
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    // Sample library data in India with latitude & longitude
    var libraries = [
        { name: "Delhi Public Library", location: "Delhi", lat: 28.6562, lon: 77.2311 },
        { name: "Asiatic Library", location: "Mumbai", lat: 18.9313, lon: 72.8345 },
        { name: "Connemara Library", location: "Chennai", lat: 13.0674, lon: 80.2579 },
        { name: "Rajasthan State Library", location: "Jaipur, Rajasthan", lat: 26.9124, lon: 75.7873 },
        { name: "Jodhpur Public Library", location: "Jodhpur, Rajasthan", lat: 26.2389, lon: 73.0243 }
    ];

    // Add markers to map for libraries
    libraries.forEach(lib => {
        let marker = L.marker([lib.lat, lib.lon]).addTo(map)
            .bindPopup(`<b>${lib.name}</b><br>${lib.location}<br>
                        <button onclick="getDirections(${lib.lat}, ${lib.lon})">Get Directions</button>`);
    });

    // Attach function to global window scope for CodePen compatibility
    window.searchLibrary = function() {
        let query = document.getElementById('searchBox').value.trim().toLowerCase();
        let libraryList = document.getElementById('libraryList');
        libraryList.innerHTML = '';

        let results = libraries.filter(lib => lib.name.toLowerCase().includes(query) || lib.location.toLowerCase().includes(query));

        if (results.length === 0) {
            libraryList.innerHTML = '<p>No libraries found.</p>';
        } else {
            results.forEach(lib => {
                let div = document.createElement('div');
                div.classList.add('library-item');
                div.innerHTML = `<h3>${lib.name}</h3><p>Location: ${lib.location}</p>
                                <button onclick="getDirections(${lib.lat}, ${lib.lon})">Get Directions</button>`;
                libraryList.appendChild(div);
            });
        }
    };

    // Function to open Google Maps for directions
    window.getDirections = function(lat, lon) {
        if (userLat !== undefined && userLon !== undefined) {
            window.open(`https://www.google.com/maps/dir/${userLat},${userLon}/${lat},${lon}/`, "_blank");
        } else {
            alert("User location not found. Enable location access.");
        }
    };
};
