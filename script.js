document.addEventListener("DOMContentLoaded", function () {
    displayLibraries();
});

// Sample Libraries Data
let libraries = [
    { name: "Central Library", location: "Downtown", lat: 26.9124, lng: 75.7873 },
    { name: "West End Library", location: "West End", lat: 26.8500, lng: 75.8100 },
    { name: "East Side Library", location: "East Side", lat: 26.9200, lng: 75.7900 }
];

// Function to Display Libraries
function displayLibraries() {
    let libraryList = document.getElementById("libraryList");
    libraryList.innerHTML = "";
    libraries.forEach(lib => {
        let div = document.createElement("div");
        div.classList.add("library-item");
        div.innerHTML = `<h3>${lib.name}</h3>
                         <p>Location: ${lib.location}</p>
                         <button onclick="getDirections(${lib.lat}, ${lib.lng})">Get Directions</button>`;
        libraryList.appendChild(div);
    });
}

// Search Library Function
function searchLibrary() {
    let query = document.getElementById("searchBox").value.trim().toLowerCase();
    let filteredLibraries = libraries.filter(lib => lib.name.toLowerCase().includes(query));
    let libraryList = document.getElementById("libraryList");
    libraryList.innerHTML = "";

    if (filteredLibraries.length === 0) {
        libraryList.innerHTML = "<p>No libraries found.</p>";
    } else {
        filteredLibraries.forEach(lib => {
            let div = document.createElement("div");
            div.classList.add("library-item");
            div.innerHTML = `<h3>${lib.name}</h3>
                             <p>Location: ${lib.location}</p>
                             <button onclick="getDirections(${lib.lat}, ${lib.lng})">Get Directions</button>`;
            libraryList.appendChild(div);
        });
    }
}

// Get Directions Function
function getDirections(lat, lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
}

// Open and Close Login Modal
function openLoginModal() {
    document.getElementById("loginModal").style.display = "block";
}

function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
}

// Open and Close Admin Login Modal
function openAdminLoginModal() {
    document.getElementById("loginModal").style.display = "block";
}

function loginUser() {
    let phoneNumber = document.getElementById("phoneNumber").value;
    let email = document.getElementById("email").value;

    if (phoneNumber && email) {
        alert("Login successful!");
        closeLoginModal();
    } else {
        alert("Please enter both Mobile Number and Email.");
    }
}

// Forgot Password Functionality
function forgotPassword() {
    document.getElementById("forgotPasswordModal").style.display = "block";
}

function closeForgotPasswordModal() {
    document.getElementById("forgotPasswordModal").style.display = "none";
}

function resetPassword() {
    let phone = document.getElementById("resetPhoneNumber").value;
    let email = document.getElementById("resetEmail").value;

    if (phone && email) {
        alert("Password reset link sent to your email!");
        closeForgotPasswordModal();
    } else {
        alert("Please enter registered Mobile Number and Email.");
    }
}