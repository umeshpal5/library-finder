// Sample Data - In real app, this would come from a database
let libraries = [
    {
        id: 1,
        name: "Sharma Study Point",
        location: "Vaishali Nagar",
        contact: "9876543210",
        fees: "₹800/month",
        timings: "7AM-10PM",
        facilities: "AC, WiFi, Silent Zone",
        adminUsername: "sharma_lib",
        adminPassword: "sharma123",
        isActive: true,
        lastPaymentDate: "2023-11-01"
    },
    {
        id: 2,
        name: "Agarwal Library",
        location: "Raja Park",
        contact: "9876543211",
        fees: "₹1000/month",
        timings: "6AM-11PM",
        facilities: "WiFi, CCTV, Coffee",
        adminUsername: "agarwal_lib",
        adminPassword: "agarwal123",
        isActive: true,
        lastPaymentDate: "2023-11-05"
    }
];

let students = [
    { id: 1, name: "Rahul Sharma", libraryId: 1, joinDate: "2023-10-15", feeDueDate: "2023-12-15" },
    { id: 2, name: "Priya Singh", libraryId: 1, joinDate: "2023-11-01", feeDueDate: "2023-12-01" },
    { id: 3, name: "Amit Patel", libraryId: 2, joinDate: "2023-10-20", feeDueDate: "2023-12-20" }
];

// Current User
let currentUser = null;

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const studentView = document.getElementById('student-view');
const adminView = document.getElementById('admin-view');
const superadminView = document.getElementById('superadmin-view');

// Login Function
function login() {
    const userType = document.getElementById('user-type').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Reset
    loginScreen.classList.add('hidden');
    studentView.classList.add('hidden');
    adminView.classList.add('hidden');
    superadminView.classList.add('hidden');

    if (userType === 'student') {
        currentUser = { type: 'student' };
        studentView.classList.remove('hidden');
        loadStudentView();
    } 
    else if (userType === 'admin') {
        const library = libraries.find(lib => 
            lib.adminUsername === username && lib.adminPassword === password && lib.isActive
        );
        
        if (library) {
            currentUser = { type: 'admin', libraryId: library.id };
            adminView.classList.remove('hidden');
            loadAdminView(library.id);
        } else {
            alert("Invalid credentials or account blocked");
            loginScreen.classList.remove('hidden');
        }
    } 
    else if (userType === 'superadmin') {
        if (username === "superadmin" && password === "admin123") {
            currentUser = { type: 'superadmin' };
            superadminView.classList.remove('hidden');
            loadSuperAdminView();
        } else {
            alert("Invalid super admin credentials");
            loginScreen.classList.remove('hidden');
        }
    }
}

// Logout Function
function logout() {
    currentUser = null;
    studentView.classList.add('hidden');
    adminView.classList.add('hidden');
    superadminView.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    
    // Clear form fields
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Load Student View
function loadStudentView() {
    const libraryList = document.getElementById('library-list');
    libraryList.innerHTML = '';
    
    const activeLibraries = libraries.filter(lib => lib.isActive);
    
    activeLibraries.forEach(library => {
        const card = document.createElement('div');
        card.className = 'library-card';
        card.innerHTML = `
            <h3>${library.name}</h3>
            <p><strong>Location:</strong> ${library.location}</p>
            <p><strong>Contact:</strong> ${library.contact}</p>
            <p><strong>Fees:</strong> ${library.fees}</p>
            <p><strong>Timings:</strong> ${library.timings}</p>
            <p><strong>Facilities:</strong> ${library.facilities}</p>
        `;
        libraryList.appendChild(card);
    });
}

// Search Libraries
function searchLibraries() {
    const searchTerm = document.getElementById('search-libraries').value.toLowerCase();
    const cards = document.querySelectorAll('.library-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Load Admin View
function loadAdminView(libraryId) {
    const library = libraries.find(lib => lib.id === libraryId);
    
    // Load Library Info Tab
    const libraryInfoTab = document.getElementById('library-info');
    libraryInfoTab.innerHTML = `
        <h3>Edit Library Information</h3>
        <div class="form-group">
            <label>Library Name</label>
            <input type="text" id="lib-name" value="${library.name}">
        </div>
        <div class="form-group">
            <label>Location</label>
            <input type="text" id="lib-location" value="${library.location}">
        </div>
        <div class="form-group">
            <label>Contact</label>
            <input type="text" id="lib-contact" value="${library.contact}">
        </div>
        <div class="form-group">
            <label>Fees</label>
            <input type="text" id="lib-fees" value="${library.fees}">
        </div>
        <div class="form-group">
            <label>Timings</label>
            <input type="text" id="lib-timings" value="${library.timings}">
        </div>
        <div class="form-group">
            <label>Facilities</label>
            <textarea id="lib-facilities">${library.facilities}</textarea>
        </div>
        <div class="form-actions">
            <button class="save-btn" onclick="saveLibraryInfo(${libraryId})">Save Changes</button>
        </div>
    `;
    
    // Load Manage Students Tab
    const manageStudentsTab = document.getElementById('manage-students');
    const libraryStudents = students.filter(student => student.libraryId === libraryId);
    
    let studentsHTML = `<h3>Student Management</h3>
        <table>
            <tr>
                <th>Name</th>
                <th>Join Date</th>
                <th>Fee Due Date</th>
                <th>Actions</th>
            </tr>`;
    
    libraryStudents.forEach(student => {
        studentsHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.joinDate}</td>
                <td>${student.feeDueDate}</td>
                <td>
                    <button class="action-btn edit-btn">Edit</button>
                    <button class="action-btn delete-btn">Remove</button>
                </td>
            </tr>
        `;
    });
    
    studentsHTML += `</table>`;
    manageStudentsTab.innerHTML = studentsHTML;
}

// Save Library Info
function saveLibraryInfo(libraryId) {
    const library = libraries.find(lib => lib.id === libraryId);
    
    library.name = document.getElementById('lib-name').value;
    library.location = document.getElementById('lib-location').value;
    library.contact = document.getElementById('lib-contact').value;
    library.fees = document.getElementById('lib-fees').value;
    library.timings = document.getElementById('lib-timings').value;
    library.facilities = document.getElementById('lib-facilities').value;
    
    alert("Library information updated successfully!");
}

// Show Tab
function showTab(tabId) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.add('hidden');
    });
    document.getElementById(tabId).classList.remove('hidden');
}

// Load Super Admin View
function loadSuperAdminView() {
    // Load Manage Libraries Tab
    const manageLibrariesTab = document.getElementById('manage-libraries');
    
    let librariesHTML = `<h3>All Libraries</h3>
        <table>
            <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Last Payment</th>
                <th>Actions</th>
            </tr>`;
    
    libraries.forEach(library => {
        librariesHTML += `
            <tr>
                <td>${library.name}</td>
                <td>${library.location}</td>
                <td>${library.contact}</td>
                <td>${library.isActive ? 'Active' : 'Blocked'}</td>
                <td>${library.lastPaymentDate}</td>
                <td>
                    <button class="action-btn ${library.isActive ? 'block-btn' : 'edit-btn'}" 
                        onclick="toggleLibraryStatus(${library.id}, ${!library.isActive})">
                        ${library.isActive ? 'Block' : 'Unblock'}
                    </button>
                </td>
            </tr>
        `;
    });
    
    librariesHTML += `</table>`;
    manageLibrariesTab.innerHTML = librariesHTML;
    
    // Load Payment Tracker Tab
    const paymentTrackerTab = document.getElementById('payment-tracker');
    paymentTrackerTab.innerHTML = `
        <h3>Payment Status</h3>
        <p>In your offline register, maintain:</p>
        <ul>
            <li>Library Name</li>
            <li>Owner Contact</li>
            <li>Monthly Fee Amount</li>
            <li>Last Payment Date</li>
            <li>Next Due Date</li>
            <li>Payment Status (Paid/Unpaid)</li>
        </ul>
        <p>Call each library owner before due date for payment collection.</p>
    `;
}

// Toggle Library Status
function toggleLibraryStatus(libraryId, newStatus) {
    const library = libraries.find(lib => lib.id === libraryId);
    library.isActive = newStatus;
    loadSuperAdminView();
    alert(`Library ${newStatus ? 'unblocked' : 'blocked'} successfully!`);
}

// Add New Library (Super Admin)
function addNewLibrary() {
    const newId = libraries.length > 0 ? Math.max(...libraries.map(lib => lib.id)) + 1 : 1;
    
    const newLibrary = {
        id: newId,
        name: "New Library",
        location: "",
        contact: "",
        fees: "",
        timings: "",
        facilities: "",
        adminUsername: `library${newId}`,
        adminPassword: `pass${newId}`,
        isActive: true,
        lastPaymentDate: new Date().toISOString().split('T')[0]
    };
    
    libraries.push(newLibrary);
    loadSuperAdminView();
}