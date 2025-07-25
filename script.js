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
        coordinates: { lat: 26.9124, lng: 75.7873 },
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
        coordinates: { lat: 26.8995, lng: 75.7963 },
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

// Initialize Map when page loads
window.onload = function() {
    initMap();
};

// Initialize Google Map
function initMap() {
    // Default to Jaipur coordinates
    const jaipur = { lat: 26.9124, lng: 75.7873 };
    
    map = new google.maps.Map(document.getElementById("map"), {
        center: jaipur,
        zoom: 12
    });
    
    // Add markers for all active libraries
    updateLibraryMarkers();
    
    // Add search box functionality
    const searchBox = new google.maps.places.SearchBox(document.getElementById("search-box"));
    
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });
    
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;
        
        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
            if (!place.geometry) return;
            bounds.extend(place.geometry.location);
        });
        map.fitBounds(bounds);
    });
}

// Update library markers on map
function updateLibraryMarkers() {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    // Add new markers for active libraries
    libraries.filter(lib => lib.isActive).forEach(library => {
        const marker = new google.maps.Marker({
            position: library.coordinates,
            map: map,
            title: library.name
        });
        
        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <h3>${library.name}</h3>
                <p><b>Location:</b> ${library.location}</p>
                <p><b>Contact:</b> ${library.contact}</p>
                <p><b>Fees:</b> ${library.fees}</p>
                <p><b>Timings:</b> ${library.timings}</p>
            `
        });
        
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
        
        markers.push(marker);
    });
}

// Show login screen
function showLogin(type) {
    document.getElementById('map-screen').classList.add('hidden');
    document.getElementById(`${type}-login`).classList.remove('hidden');
}

// Hide login screen
function hideLogin() {
    document.getElementById('superadmin-login').classList.add('hidden');
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('map-screen').classList.remove('hidden');
}

// Super Admin Login
function loginSuperAdmin() {
    const password = document.getElementById('superadmin-password').value;
    
    // Hardcoded super admin password (change this in production)
    if (password === "admin123") {
        currentUser = { type: "superadmin" };
        hideLogin();
        showSuperAdminPanel();
    } else {
        alert("Invalid super admin password");
    }
}

// Library Admin Login
function loginLibraryAdmin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    const library = libraries.find(lib => 
        lib.adminUsername === username && 
        lib.adminPassword === password &&
        lib.isActive
    );
    
    if (library) {
        currentUser = { type: "admin", libraryId: library.id };
        hideLogin();
        showAdminPanel(library.id);
    } else {
        alert("Invalid credentials or account blocked");
    }
}

// Show Super Admin Panel
function showSuperAdminPanel() {
    document.getElementById('map-screen').classList.add('hidden');
    document.getElementById('superadmin-panel').classList.remove('hidden');
    
    // Load libraries list
    const librariesList = document.getElementById('libraries-list');
    librariesList.innerHTML = '';
    
    libraries.forEach(library => {
        const card = document.createElement('div');
        card.className = 'library-card';
        card.innerHTML = `
            <h3>${library.name}</h3>
            <p><b>Location:</b> ${library.location}</p>
            <p><b>Status:</b> ${library.isActive ? 'Active' : 'Blocked'}</p>
            <div class="form-actions">
                <button class="btn ${library.isActive ? 'btn-danger' : 'btn-success'}" 
                    onclick="toggleLibraryStatus(${library.id})">
                    ${library.isActive ? 'Block' : 'Unblock'}
                </button>
            </div>
        `;
        librariesList.appendChild(card);
    });
}

// Show Admin Panel
function showAdminPanel(libraryId) {
    const library = libraries.find(lib => lib.id === libraryId);
    
    document.getElementById('map-screen').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    document.getElementById('admin-library-name').textContent = library.name + " - Admin Panel";
    
    // Load library info tab
    loadLibraryInfoTab(libraryId);
}

// Load Library Info Tab
function loadLibraryInfoTab(libraryId) {
    const library = libraries.find(lib => lib.id === libraryId);
    const tab = document.getElementById('admin-info-tab');
    
    tab.innerHTML = `
        <div class="form-group">
            <label>Library Name</label>
            <input type="text" id="edit-lib-name" value="${library.name}">
        </div>
        <div class="form-group">
            <label>Location</label>
            <input type="text" id="edit-lib-location" value="${library.location}">
        </div>
        <div class="form-group">
            <label>Contact Number</label>
            <input type="text" id="edit-lib-contact" value="${library.contact}">
        </div>
        <div class="form-group">
            <label>Fees Structure</label>
            <input type="text" id="edit-lib-fees" value="${library.fees}">
        </div>
        <div class="form-group">
            <label>Timings</label>
            <input type="text" id="edit-lib-timings" value="${library.timings}">
        </div>
        <div class="form-group">
            <label>Facilities</label>
            <textarea id="edit-lib-facilities">${library.facilities}</textarea>
        </div>
        <div class="form-actions">
            <button class="btn btn-primary" onclick="saveLibraryInfo(${libraryId})">Save Changes</button>
        </div>
    `;
}

// Save Library Info
function saveLibraryInfo(libraryId) {
    const library = libraries.find(lib => lib.id === libraryId);
    
    library.name = document.getElementById('edit-lib-name').value;
    library.location = document.getElementById('edit-lib-location').value;
    library.contact = document.getElementById('edit-lib-contact').value;
    library.fees = document.getElementById('edit-lib-fees').value;
    library.timings = document.getElementById('edit-lib-timings').value;
    library.facilities = document.getElementById('edit-lib-facilities').value;
    
    alert("Library information updated successfully!");
    updateLibraryMarkers();
}

// Toggle Library Status
function toggleLibraryStatus(libraryId) {
    const library = libraries.find(lib => lib.id === libraryId);
    library.isActive = !library.isActive;
    showSuperAdminPanel();
    updateLibraryMarkers();
}

// Show Admin Tab
function showAdminTab(tabId) {
    document.getElementById('admin-info-tab').classList.remove('active');
    document.getElementById('admin-students-tab').classList.remove('active');
    document.getElementById(`admin-${tabId}-tab`).classList.add('active');
    
    // Update tab buttons
    const buttons = document.querySelectorAll('.admin-tabs button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load students tab if selected
    if (tabId === 'students') {
        loadStudentsTab(currentUser.libraryId);
    }
}

// Load Students Tab
function loadStudentsTab(libraryId) {
    const tab = document.getElementById('admin-students-tab');
    const libraryStudents = students.filter(student => student.libraryId === libraryId);
    
    let html = `
        <h3>Student Management</h3>
        <button class="btn btn-primary" onclick="showAddStudentForm()">Add New Student</button>
        <table>
            <tr>
                <th>Name</th>
                <th>Join Date</th>
                <th>Fee Due Date</th>
                <th>Actions</th>
            </tr>
    `;
    
    libraryStudents.forEach(student => {
        html += `
            <tr>
                <td>${student.name}</td>
                <td>${student.joinDate}</td>
                <td>${student.feeDueDate}</td>
                <td>
                    <button class="btn btn-primary">Edit</button>
                    <button class="btn btn-danger">Remove</button>
                </td>
            </tr>
        `;
    });
    
    html += `</table>`;
    tab.innerHTML = html;
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById('superadmin-panel').classList.add('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('map-screen').classList.remove('hidden');
}

// Search Libraries
function searchLibraries() {
    const searchTerm = document.getElementById('search-box').value.toLowerCase();
    
    // Filter and show matching markers
    libraries.filter(lib => 
        lib.isActive && 
        (lib.name.toLowerCase().includes(searchTerm) || 
         lib.location.toLowerCase().includes(searchTerm))
    ).forEach(lib => {
        const marker = markers.find(m => m.getTitle() === lib.name);
        if (marker) {
            marker.setVisible(true);
            // Pan to the first matching library
            if (libraries[0].name === lib.name) {
                map.panTo(lib.coordinates);
            }
        }
    });
    
    // Hide non-matching markers
    libraries.filter(lib => 
        !lib.name.toLowerCase().includes(searchTerm) && 
        !lib.location.toLowerCase().includes(searchTerm)
    ).forEach(lib => {
        const marker = markers.find(m => m.getTitle() === lib.name);
        if (marker) marker.setVisible(false);
    });
}