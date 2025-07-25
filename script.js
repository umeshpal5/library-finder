// Sample Data
const libraries = [
    {
        id: 1,
        name: "Sharma Study Point",
        location: "Vaishali Nagar, Jaipur",
        contact: "9876543210",
        fees: "₹800/month",
        timings: "7AM-10PM",
        facilities: "AC, WiFi, Silent Zone",
        coordinates: [26.9124, 75.7873], // [lat, lng] for Leaflet
        adminUsername: "sharma_lib",
        adminPassword: "sharma123",
        isActive: true
    },
    {
        id: 2,
        name: "Agarwal Library",
        location: "Raja Park, Jaipur",
        contact: "9876543211",
        fees: "₹1000/month",
        timings: "6AM-11PM",
        facilities: "WiFi, CCTV, Coffee",
        coordinates: [26.8995, 75.7963],
        adminUsername: "agarwal_lib",
        adminPassword: "agarwal123",
        isActive: true
    }
];

let students = [
    { id: 1, name: "Rahul Sharma", libraryId: 1, joinDate: "2023-10-15", feeDueDate: "2023-12-15" },
    { id: 2, name: "Priya Singh", libraryId: 1, joinDate: "2023-11-01", feeDueDate: "2023-12-01" }
];

// App State
let currentUser = null;
let map;
let markers = [];

// Initialize Leaflet Map when page loads
window.onload = function() {
    initMap();
};

// Initialize Leaflet Map (Free)
function initMap() {
    // Default to Jaipur coordinates
    map = L.map('map').setView([26.9124, 75.7873], 12);
    
    // Use OpenStreetMap tiles (free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    // Add markers for all active libraries
    updateLibraryMarkers();
}

// Update library markers on map
function updateLibraryMarkers() {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Add new markers for active libraries
    libraries.filter(lib => lib.isActive).forEach(library => {
        const marker = L.marker(library.coordinates)
            .addTo(map)
            .bindPopup(`
                <h3>${library.name}</h3>
                <p><b>Location:</b> ${library.location}</p>
                <p><b>Contact:</b> ${library.contact}</p>
                <p><b>Fees:</b> ${library.fees}</p>
                <p><b>Timings:</b> ${library.timings}</p>
            `);
        
        markers.push(marker);
    });
}

// Search Libraries (Basic Filter)
function searchLibraries() {
    const searchTerm = document.getElementById('search-box').value.toLowerCase();
    
    markers.forEach(marker => {
        const libName = marker.getPopup().getContent().toLowerCase();
        if (libName.includes(searchTerm)) {
            marker.openPopup();
            map.setView(marker.getLatLng(), 15);
        }
    });
}

// Rest of your existing functions remain the same...
// (loginSuperAdmin, loginLibraryAdmin, showAdminPanel, etc.)
// Just keep them as they were in the previous version