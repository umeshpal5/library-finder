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
        isActive: true,
        lastPayment: "2023-11-15"
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
        isActive: true,
        lastPayment: "2023-11-10"
    }
];

let students = [
    { id: 1, name: "Rahul Sharma", libraryId: 1, joinDate: "2023-10-15", feeDueDate: "2023-12-15" },
    { id: 2, name: "Priya Singh", libraryId: 1, joinDate: "2023-11-01", feeDueDate: "2023-12-01" },
    { id: 3, name: "Amit Patel", libraryId: 2, joinDate: "2023-10-20", feeDueDate: "2023-12-20" }
];

// App State
let currentUser = null;
let map;
let markers = [];

// Initialize Leaflet Map
function initMap() {
    // Default to Jaipur coordinates
    map = L.map('map').setView([26.9124, 75.7873], 13);
    
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
    
    // Custom icon
    const libraryIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
    
    // Add new markers for active libraries
    libraries.filter(lib => lib.isActive).forEach(library => {
        const marker = L.marker(library.coordinates, { icon: libraryIcon })
            .addTo(map)
            .bindPopup(`
                <div class="map-popup">
                    <h3>${library.name}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${library.location}</p>
                    <p><i class="fas fa-phone"></i> ${library.contact}</p>
                    <p><i class="fas fa-rupee-sign"></i> ${library.fees}</p>
                    <p><i class="fas fa-clock"></i> ${library.timings}</p>
                    <p><i class="fas fa-star"></i> ${library.facilities}</p>
                </div>
            `, { maxWidth: 250 });
        
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
        lib.adminPassword === password
    );
    
    if (library) {
        if (!library.isActive) {
            alert("Your library account is currently blocked. Please contact super admin.");
            return;
        }
        
        currentUser = { type: "admin", libraryId: library.id };
        hideLogin();
        showAdminPanel(library.id);
    } else {
        alert("Invalid credentials");
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
            <p><i class="fas fa-map-marker-alt"></i> ${library.location}</p>
            <p><i class="fas fa-phone"></i> ${library.contact}</p>
            <p><i class="fas fa-calendar-check"></i> Last Payment: ${library.lastPayment}</p>
            <span class="status ${library.isActive ? 'active' : 'inactive'}">
                ${library.isActive ? 'Active' : 'Blocked'}
            </span>
            <div class="action-buttons">
                <button class="action-btn btn-edit" onclick="editLibrary(${library.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn btn-block" onclick="toggleLibraryStatus(${library.id})">
                    ${library.isActive ? '<i class="fas fa-ban"></i> Block' : '<i class="fas fa-check"></i> Unblock'}
                </button>
            </div>
        `;
        librariesList.appendChild(card);
    });
}

// Edit Library
function editLibrary(libraryId) {
    const library = libraries.find(lib => lib.id === libraryId);
    
    const librariesList = document.getElementById('libraries-list');
    librariesList.innerHTML = `
        <div class="library-card">
            <h3>Edit Library</h3>
            <div class="form-group">
                <label>Library Name</label>
                <input type="text" id="edit-name" value="${library.name}">
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" id="edit-location" value="${library.location}">
            </div>
            <div class="form-group">
                <label>Contact</label>
                <input type="text" id="edit-contact" value="${library.contact}">
            </div>
            <div class="form-group">
                <label>Fees</label>
                <input type="text" id="edit-fees" value="${library.fees}">
            </div>
            <div class="form-group">
                <label>Timings</label>
                <input type="text" id="edit-timings" value="${library.timings}">
            </div>
            <div class="form-group">
                <label>Facilities</label>
                <textarea id="edit-facilities">${library.facilities}</textarea>
            </div>
            <div class="form-actions">
                <button class="btn-save" onclick="saveLibraryChanges(${libraryId})">
                    <i class="fas fa-save"></i> Save Changes
                </button>
                <button class="btn-cancel" onclick="showSuperAdminPanel()">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `;
}

// Save Library Changes
function saveLibraryChanges(libraryId) {
    const library = libraries.find(lib => lib.id === libraryId);
    
    library.name = document.getElementById('edit-name').value;
    library.location = document.getElementById('edit-location').value;
    library.contact = document.getElementById('edit-contact').value;
    library.fees = document.getElementById('edit-fees').value;
    library.timings = document.getElementById('edit-timings').value;
    library.facilities = document.getElementById('edit-facilities').value;
    
    alert("Library updated successfully!");
    showSuperAdminPanel();
    updateLibraryMarkers();
}

// Toggle Library Status
function toggleLibraryStatus(libraryId) {
    const library = libraries.find(lib => lib.id === libraryId);
    library.isActive = !library.isActive;
    
    if (library.isActive) {
        library.lastPayment = new Date().toISOString().split('T')[0];
    }
    
    showSuperAdminPanel();
    updateLibraryMarkers();
}

// Show Admin Panel
function showAdminPanel(libraryId) {
    const library = libraries.find(lib => lib.id === libraryId);
    
    document.getElementById('map-screen').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    document.getElementById('admin-library-name').textContent = library.name;
    
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
            <button class="btn-save" onclick="saveLibraryInfo(${libraryId})">
                <i class="fas fa-save"></i> Save Changes
            </button>
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

// Show Admin Tab
function showAdminTab(tabId) {
    document.getElementById('admin-info-tab').classList.remove('active');
    document.getElementById('admin-students-tab').classList.remove('active');
    document.getElementById(`admin-${tabId}-tab`).classList.add('active');
    
    // Update tab buttons
    const buttons = document.querySelectorAll('.tab-btn');
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
        <button class="btn-add" onclick="showAddStudentForm()">
            <i class="fas fa-plus"></i> Add New Student
        </button>
        <div class="student-list">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Join Date</th>
                        <th>Fee Due Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    libraryStudents.forEach(student => {
        html += `
            <tr>
                <td>${student.name}</td>
                <td>${student.joinDate}</td>
                <td>${student.feeDueDate}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editStudent(${student.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-block" onclick="removeStudent(${student.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    tab.innerHTML = html;
}

// Show Add Student Form
function showAddStudentForm() {
    const tab = document.getElementById('admin-students-tab');
    
    tab.innerHTML = `
        <h3>Add New Student</h3>
        <div class="form-group">
            <label>Student Name</label>
            <input type="text" id="new-student-name" placeholder="Enter student name">
        </div>
        <div class="form-group">
            <label>Join Date</label>
            <input type="date" id="new-student-join-date">
        </div>
        <div class="form-group">
            <label>Fee Due Date</label>
            <input type="date" id="new-student-fee-date">
        </div>
        <div class="form-actions">
            <button class="btn-save" onclick="addNewStudent()">
                <i class="fas fa-save"></i> Save Student
            </button>
            <button class="btn-cancel" onclick="showAdminTab('students')">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('new-student-join-date').value = today;
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    document.getElementById('new-student-fee-date').value = nextMonth.toISOString().split('T')[0];
}

// Add New Student
function addNewStudent() {
    const name = document.getElementById('new-student-name').value;
    const joinDate = document.getElementById('new-student-join-date').value;
    const feeDate = document.getElementById('new-student-fee-date').value;
    
    if (!name) {
        alert("Please enter student name");
        return;
    }
    
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    
    students.push({
        id: newId,
        name: name,
        libraryId: currentUser.libraryId,
        joinDate: joinDate,
        feeDueDate: feeDate
    });
    
    alert("Student added successfully!");
    showAdminTab('students');
}

// Edit Student
function editStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    const tab = document.getElementById('admin-students-tab');
    
    tab.innerHTML = `
        <h3>Edit Student</h3>
        <div class="form-group">
            <label>Student Name</label>
            <input type="text" id="edit-student-name" value="${student.name}">
        </div>
        <div class="form-group">
            <label>Join Date</label>
            <input type="date" id="edit-student-join-date" value="${student.joinDate}">
        </div>
        <div class="form-group">
            <label>Fee Due Date</label>
            <input type="date" id="edit-student-fee-date" value="${student.feeDueDate}">
        </div>
        <div class="form-actions">
            <button class="btn-save" onclick="saveStudentChanges(${studentId})">
                <i class="fas fa-save"></i> Save Changes
            </button>
            <button class="btn-cancel" onclick="showAdminTab('students')">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;
}

// Save Student Changes
function saveStudentChanges(studentId) {
    const student = students.find(s => s.id === studentId);
    
    student.name = document.getElementById('edit-student-name').value;
    student.joinDate = document.getElementById('edit-student-join-date').value;
    student.feeDueDate = document.getElementById('edit-student-fee-date').value;
    
    alert("Student updated successfully!");
    showAdminTab('students');
}

// Remove Student
function removeStudent(studentId) {
    if (confirm("Are you sure you want to remove this student?")) {
        students = students.filter(s => s.id !== studentId);
        showAdminTab('students');
    }
}

// Add New Library (Super Admin)
function addNewLibrary() {
    const newId = libraries.length > 0 ? Math.max(...libraries.map(lib => lib.id)) + 1 : 1;
    
    const newLibrary = {
        id: newId,
        name: "New Library",
        location: "Jaipur",
        contact: "",
        fees: "₹0/month",
        timings: "8AM-8PM",
        facilities: "",
        coordinates: [26.9124, 75.7873],
        adminUsername: `library${newId}`,
        adminPassword: `pass${newId}`,
        isActive: true,
        lastPayment: new Date().toISOString().split('T')[0]
    };
    
    libraries.push(newLibrary);
    showSuperAdminPanel();
    updateLibraryMarkers();
}

// Search Libraries
function searchLibraries() {
    const searchTerm = document.getElementById('search-box').value.toLowerCase();
    
    if (!searchTerm) {
        markers.forEach(marker => marker.setOpacity(1));
        return;
    }
    
    markers.forEach(marker => {
        const libName = marker.getPopup().getContent().toLowerCase();
        if (libName.includes(searchTerm)) {
            marker.setOpacity(1);
            map.setView(marker.getLatLng(), 15);
            marker.openPopup();
        } else {
            marker.setOpacity(0.3);
        }
    });
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById('superadmin-panel').classList.add('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('map-screen').classList.remove('hidden');
}