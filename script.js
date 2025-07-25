document.addEventListener('DOMContentLoaded', () => {
    // ############### DATA INITIALIZATION ###############
    // This part simulates a database. In a real app, this data would come from a server.

    const DOM = {
        views: {
            libraryList: document.getElementById('library-list-view'),
            superAdminDashboard: document.getElementById('super-admin-dashboard-view'),
            adminDashboard: document.getElementById('admin-dashboard-view'),
        },
        libraryListContainer: document.getElementById('library-list-container'),
        searchInput: document.getElementById('search-input'),
        adminListContainer: document.getElementById('admin-list-container'),
        studentListContainer: document.getElementById('student-list-container'),
        modals: {
            login: document.getElementById('login-modal'),
            addStudent: document.getElementById('add-student-modal'),
        },
        forms: {
            login: document.getElementById('login-form'),
            addStudent: document.getElementById('add-student-form'),
            librarySetup: document.getElementById('library-setup-form'),
        },
        buttons: {
            showSuperAdminLogin: document.getElementById('show-super-admin-login-btn'),
            showAdminLogin: document.getElementById('show-admin-login-btn'),
            superAdminLogout: document.getElementById('super-admin-logout-btn'),
            adminLogout: document.getElementById('admin-logout-btn'),
            saveLibrarySetup: document.getElementById('save-library-setup-btn'),
            showAddStudentModal: document.getElementById('show-add-student-modal-btn'),
        },
        other: {
            loginTitle: document.getElementById('login-title'),
            loginError: document.getElementById('login-error'),
            adminLibraryName: document.getElementById('admin-library-name'),
            adminMainContent: document.getElementById('admin-main-content'),
        }
    };
    
    let state = {
        currentUser: null, // { type: 'superadmin' } or { type: 'admin', username: '...' }
        loginType: null, // 'superadmin' or 'admin'
        superAdmin: {
            username: 'superadmin',
            password: 'superpassword123'
        },
        admins: []
    };

    /**
     * Generates 200 admin credentials with unique passwords.
     * This function runs only once when the app is opened for the very first time.
     */
    function generateAdminCredentials() {
        console.log("Generating 200 Admin credentials for the first time...");
        const admins = [];
        for (let i = 1; i <= 200; i++) {
            // Creates a simple random password like 'passa1b2c3'
            const randomPart = Math.random().toString(36).substring(2, 8);
            admins.push({
                username: `libraryadmin${i}`,
                password: `pass${randomPart}`,
                isBlocked: false,
                libraryInfo: null, // Will be filled on first login
                students: []
            });
        }
        // You can log this to the console to get the full list of generated passwords
        console.log("To see all generated passwords, type 'JSON.parse(localStorage.getItem(\"libraryHubData\"))' in the console.");
        return admins;
    }
    
    // ############### LOCAL STORAGE (DATABASE SIMULATION) ###############

    function saveData() {
        localStorage.setItem('libraryHubData', JSON.stringify(state.admins));
    }

    function loadData() {
        const data = localStorage.getItem('libraryHubData');
        if (data) {
            state.admins = JSON.parse(data);
        } else {
            // First time load: generate admins and save
            state.admins = generateAdminCredentials();
            saveData();
        }
    }

    // ############### UI RENDERING FUNCTIONS ###############

    function switchView(viewId) {
        Object.values(DOM.views).forEach(view => view.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
    }

    function renderLibraryList() {
        DOM.libraryListContainer.innerHTML = '';
        const searchTerm = DOM.searchInput.value.toLowerCase();
        
        const activeLibraries = state.admins.filter(admin => admin.libraryInfo && !admin.isBlocked);

        if (activeLibraries.length === 0) {
            DOM.libraryListContainer.innerHTML = '<p>अभी कोई लाइब्रेरी उपलब्ध नहीं है। जल्द ही जोड़ी जाएगी।</p>';
            return;
        }

        activeLibraries
            .filter(admin => admin.libraryInfo.name.toLowerCase().includes(searchTerm))
            .forEach(admin => {
                const lib = admin.libraryInfo;
                const card = document.createElement('div');
                card.className = 'library-card';
                card.innerHTML = `
                    <img src="${lib.photo || 'https://via.placeholder.com/400x225.png?text=Library+Image'}" alt="${lib.name}">
                    <div class="library-card-content">
                        <h3>${lib.name}</h3>
                        <p><strong>🕒 समय:</strong> ${lib.timings}</p>
                        <p><strong>💡 सुविधाएं:</strong> ${lib.facilities}</p>
                        <p><strong>📞 संपर्क:</strong> ${lib.contact}</p>
                        <p><strong>📍 दूरी:</strong> ${(Math.random() * 5 + 0.5).toFixed(1)} km दूर</p>
                        <a href="https://maps.google.com/?q=${lib.name}, Jaipur" target="_blank" class="get-directions-btn">Get Directions</a>
                    </div>
                `;
                DOM.libraryListContainer.appendChild(card);
            });
    }

    function renderSuperAdminDashboard() {
        DOM.adminListContainer.innerHTML = '';
        state.admins.forEach(admin => {
            const adminItem = document.createElement('div');
            adminItem.className = `admin-item ${admin.isBlocked ? 'blocked' : ''}`;
            adminItem.innerHTML = `
                <div class="admin-name">
                    <strong>${admin.username}</strong>
                    <span>(${admin.libraryInfo ? admin.libraryInfo.name : 'Not Setup Yet'})</span>
                </div>
                <button class="${admin.isBlocked ? 'unblock-btn' : 'block-btn'}" data-username="${admin.username}">
                    ${admin.isBlocked ? 'Unblock' : 'Block'}
                </button>
            `;
            DOM.adminListContainer.appendChild(adminItem);
        });
    }

    function renderAdminDashboard() {
        const admin = state.admins.find(a => a.username === state.currentUser.username);
        if (!admin) return;

        if (!admin.libraryInfo) {
            // First time login - show setup form
            DOM.forms.librarySetup.style.display = 'block';
            DOM.other.adminMainContent.style.display = 'none';
        } else {
            // Regular login
            DOM.forms.librarySetup.style.display = 'none';
            DOM.other.adminMainContent.style.display = 'block';
            DOM.other.adminLibraryName.textContent = `📚 ${admin.libraryInfo.name}`;
            renderStudentList(admin.students);
        }
    }
    
    function renderStudentList(students) {
        DOM.studentListContainer.innerHTML = '';
        if (students.length === 0) {
            DOM.studentListContainer.innerHTML = '<p>अभी कोई स्टूडेंट नहीं है। नया स्टूडेंट जोड़ें।</p>';
            return;
        }

        const today = new Date();
        today.setHours(0,0,0,0); // Set to beginning of today for accurate comparison

        students
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .forEach(student => {
                const dueDate = new Date(student.dueDate);
                const isDue = dueDate <= today;
                const studentItem = document.createElement('div');
                studentItem.className = `student-item ${isDue ? 'fee-due' : ''}`;
                studentItem.innerHTML = `
                    <div class="student-info">
                        <div class="student-name"><strong>${student.name}</strong> (${student.shift})</div>
                        <div class="student-details">
                            📱 ${student.mobile} | 💰 ₹${student.fee} | 📅 अगली फीस: ${new Date(student.dueDate).toLocaleDateString('en-GB')}
                        </div>
                    </div>
                    <div class="student-actions">
                        ${isDue ? '<span>Fee Due!</span>' : ''}
                    </div>
                `;
                DOM.studentListContainer.appendChild(studentItem);
            });
    }

    // ############### EVENT HANDLERS ###############

    // Show/Hide Modals
    function showModal(modal) {
        modal.style.display = 'flex';
    }
    function hideModals() {
        Object.values(DOM.modals).forEach(modal => modal.style.display = 'none');
    }
    document.querySelectorAll('.close-btn').forEach(btn => btn.addEventListener('click', hideModals));

    // Login Buttons
    DOM.buttons.showSuperAdminLogin.addEventListener('click', () => {
        state.loginType = 'superadmin';
        DOM.other.loginTitle.textContent = 'Super Admin Login';
        DOM.other.loginError.textContent = '';
        DOM.forms.login.reset();
        showModal(DOM.modals.login);
    });

    DOM.buttons.showAdminLogin.addEventListener('click', () => {
        state.loginType = 'admin';
        DOM.other.loginTitle.textContent = 'Library Admin Login';
        DOM.other.loginError.textContent = '';
        DOM.forms.login.reset();
        showModal(DOM.modals.login);
    });

    // Login Form Submission
    DOM.forms.login.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = DOM.forms.login.username.value;
        const password = DOM.forms.login.password.value;
        let loginSuccess = false;

        if (state.loginType === 'superadmin') {
            if (username === state.superAdmin.username && password === state.superAdmin.password) {
                state.currentUser = { type: 'superadmin' };
                switchView('super-admin-dashboard-view');
                renderSuperAdminDashboard();
                loginSuccess = true;
            }
        } else {
            const admin = state.admins.find(a => a.username === username && a.password === password);
            if (admin) {
                if(admin.isBlocked) {
                    DOM.other.loginError.textContent = 'Your account is blocked. Please contact Super Admin.';
                    return;
                }
                state.currentUser = { type: 'admin', username: admin.username };
                switchView('admin-dashboard-view');
                renderAdminDashboard();
                loginSuccess = true;
            }
        }

        if (loginSuccess) {
            hideModals();
        } else {
            DOM.other.loginError.textContent = 'Invalid username or password.';
        }
    });
    
    // Logout Buttons
    DOM.buttons.superAdminLogout.addEventListener('click', () => {
        state.currentUser = null;
        switchView('library-list-view');
    });
    DOM.buttons.adminLogout.addEventListener('click', () => {
        state.currentUser = null;
        switchView('library-list-view');
    });

    // Super Admin: Block/Unblock
    DOM.adminListContainer.addEventListener('click', (e) => {
        if (e.target.matches('.block-btn, .unblock-btn')) {
            const username = e.target.dataset.username;
            const admin = state.admins.find(a => a.username === username);
            if(admin) {
                admin.isBlocked = !admin.isBlocked;
                saveData();
                renderSuperAdminDashboard();
                renderLibraryList(); // Update public list as well
            }
        }
    });

    // Admin: Save Library Setup
    DOM.buttons.saveLibrarySetup.addEventListener('click', () => {
        const admin = state.admins.find(a => a.username === state.currentUser.username);
        if(!admin) return;

        const libraryInfo = {
            name: document.getElementById('setup-library-name').value,
            timings: document.getElementById('setup-library-timings').value,
            facilities: document.getElementById('setup-library-facilities').value,
            contact: document.getElementById('setup-library-contact').value,
            photo: document.getElementById('setup-library-photo').value,
        };
        
        if (!libraryInfo.name || !libraryInfo.timings || !libraryInfo.facilities || !libraryInfo.contact) {
            alert('Please fill all the required fields.');
            return;
        }

        admin.libraryInfo = libraryInfo;
        saveData();
        renderAdminDashboard();
        renderLibraryList(); // Update the public list
    });

    // Admin: Show Add Student Modal
    DOM.buttons.showAddStudentModal.addEventListener('click', () => {
        DOM.forms.addStudent.reset();
        showModal(DOM.modals.addStudent);
    });

    // Admin: Add Student Form Submission
    DOM.forms.addStudent.addEventListener('submit', (e) => {
        e.preventDefault();
        const admin = state.admins.find(a => a.username === state.currentUser.username);
        if(!admin) return;

        const newStudent = {
            name: document.getElementById('student-name').value,
            mobile: document.getElementById('student-mobile').value,
            shift: document.getElementById('student-shift').value,
            fee: document.getElementById('student-fee').value,
            submitDate: new Date().toISOString().split('T')[0],
            dueDate: document.getElementById('fee-due-date').value,
        };

        admin.students.push(newStudent);
        saveData();
        renderStudentList(admin.students);
        hideModals();
    });

    // Search functionality
    DOM.searchInput.addEventListener('input', renderLibraryList);

    // ############### APP INITIALIZATION ###############
    loadData();
    renderLibraryList();
    switchView('library-list-view');
});
