// Database Structure
let database = {
    superadmin: {
        username: "superadmin",
        password: "admin123" // Change this in production
    },
    libraries: [
        // Sample library (you'll add more manually)
        {
            id: "lib001",
            adminUsername: "lib001_user",
            adminPassword: "lib001_pass",
            isActive: true,
            isSetupComplete: false,
            libraryInfo: null,
            students: []
        }
    ]
};

// Current User
let currentUser = null;
let currentView = "all"; // all, active, blocked, incomplete

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const librariesContainer = document.getElementById('libraries-container');

// Initialize App
function initApp() {
    checkLoginStatus();
    renderLibraries();
}

// Check Login Status
function checkLoginStatus() {
    // In a real app, you would check session storage/cookies
    showLoginScreen();
}

// Show Login Screen
function showLoginScreen() {
    loginScreen.classList.remove('hidden');
    dashboard.classList.add('hidden');
}

// Login Function
function login() {
    const username = document.getElementById('superadmin-username').value;
    const password = document.getElementById('superadmin-password').value;
    
    if (username === database.superadmin.username && 
        password === database.superadmin.password) {
        currentUser = { username, role: "superadmin" };
        showDashboard();
    } else {
        alert("Invalid credentials. Try 'admin123' as password.");
    }
}

// Show Dashboard
function showDashboard() {
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    renderLibraries();
}

// Logout Function
function logout() {
    currentUser = null;
    showLoginScreen();
}

// Render Libraries
function renderLibraries(filter = "all") {
    librariesContainer.innerHTML = '';
    currentView = filter;
    
    let librariesToShow = database.libraries;
    
    // Apply filter
    switch(filter) {
        case "active":
            librariesToShow = database.libraries.filter(lib => lib.isActive && lib.isSetupComplete);
            break;
        case "blocked":
            librariesToShow = database.libraries.filter(lib => !lib.isActive);
            break;
        case "incomplete":
            librariesToShow = database.libraries.filter(lib => !lib.isSetupComplete);
            break;
    }
    
    // Render each library
    librariesToShow.forEach(library => {
        const libraryCard = document.createElement('div');
        libraryCard.className = 'library-card';
        
        // Determine status
        let statusClass, statusText;
        if (!library.isActive) {
            statusClass = "status-blocked";
            statusText = "Blocked";
        } else if (!library.isSetupComplete) {
            statusClass = "status-incomplete";
            statusText = "Incomplete";
        } else {
            statusClass = "status-active";
            statusText = "Active";
        }
        
        libraryCard.innerHTML = `
            <div class="library-card-header">
                <div class="library-name">
                    <i class="fas fa-library"></i>
                    ${library.id}
                </div>
                <div class="library-status ${statusClass}">${statusText}</div>
            </div>
            <div class="library-card-body">
                <div class="library-info">
                    <div class="info-item">
                        <span class="info-label">Admin User:</span>
                        <span class="info-value">${library.adminUsername}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status:</span>
                        <span class="info-value">${statusText}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Students:</span>
                        <span class="info-value">${library.students.length}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Last Updated:</span>
                        <span class="info-value">Today</span>
                    </div>
                </div>
                <div class="library-actions">
                    <button onclick="viewLibraryDetails('${library.id}')" class="action-btn btn-view">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button onclick="editLibrary('${library.id}')" class="action-btn btn-edit">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `;
        
        librariesContainer.appendChild(libraryCard);
    });
}

// Filter Libraries
function filterLibraries(filter) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    renderLibraries(filter);
}

// View Library Details
function viewLibraryDetails(libId) {
    const library = database.libraries.find(lib => lib.id === libId);
    if (!library) return;
    
    // Update modal content
    document.getElementById('lib-modal-title').innerHTML = `
        <i class="fas fa-library"></i> ${libId} Details
    `;
    
    document.getElementById('lib-status').textContent = library.isActive ? "Active" : "Blocked";
    document.getElementById('lib-status').className = `status-badge ${library.isActive ? "active" : "blocked"}`;
    
    document.getElementById('lib-username').textContent = library.adminUsername;
    document.getElementById('lib-password').textContent = "•••••••";
    
    document.getElementById('status-toggle-btn').innerHTML = `
        <i class="fas fa-${library.isActive ? "ban" : "check"}"></i> ${library.isActive ? "Block" : "Unblock"}
    `;
    document.getElementById('status-toggle-btn').className = `status-btn ${library.isActive ? "block" : "unblock"}`;
    
    document.getElementById('total-students').textContent = library.students.length;
    document.getElementById('active-students').textContent = library.students.filter(s => {
        // In real app, check fee due date
        return true;
    }).length;
    
    document.getElementById('fee-due').textContent = library.students.filter(s => {
        // In real app, check if fee is due
        return false;
    }).length;
    
    // Show modal
    document.getElementById('library-details-modal').classList.remove('hidden');
}

// Toggle Library Status
function toggleLibraryStatus() {
    const libId = document.getElementById('lib-modal-title').textContent.split(" ")[0];
    const library = database.libraries.find(lib => lib.id === libId);
    
    if (library) {
        library.isActive = !library.isActive;
        renderLibraries(currentView);
        viewLibraryDetails(libId); // Refresh modal
    }
}

// Show Add Library Modal
function showAddLibraryModal() {
    document.getElementById('add-library-modal').classList.remove('hidden');
}

// Close Modal
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Add New Library
function addNewLibrary() {
    const name = document.getElementById('new-lib-name').value;
    const username = document.getElementById('new-lib-username').value;
    const password = document.getElementById('new-lib-password').value;
    
    if (!name || !username || !password) {
        alert("Please fill all fields");
        return;
    }
    
    const newId = `lib${(database.libraries.length + 1).toString().padStart(3, '0')}`;
    
    database.libraries.push({
        id: newId,
        adminUsername: username,
        adminPassword: password,
        isActive: true,
        isSetupComplete: false,
        libraryInfo: null,
        students: []
    });
    
    closeModal();
    renderLibraries(currentView);
    alert(`Library ${newId} created successfully! Credentials: ${username}/${password}`);
}

// Show Password
function showPassword() {
    const libId = document.getElementById('lib-modal-title').textContent.split(" ")[0];
    const library = database.libraries.find(lib => lib.id === libId);
    
    if (library) {
        const passwordEl = document.getElementById('lib-password');
        if (passwordEl.textContent === "•••••••") {
            passwordEl.textContent = library.adminPassword;
        } else {
            passwordEl.textContent = "•••••••";
        }
    }
}

// Edit Library
function editLibrary(libId) {
    // In a complete app, this would open an edit form
    alert(`Edit functionality for ${libId} will be implemented in the full version`);
}

// Show Library Students
function showLibraryStudents() {
    alert("Student management will be implemented in the full version");
}

// Show Library Setup
function showLibrarySetup() {
    alert("Library profile setup will be implemented in the full version");
}

// Send Credentials
function sendCredentials() {
    alert("Credentials sending functionality will be implemented in the full version");
}

// Initialize the app when loaded
window.onload = initApp;