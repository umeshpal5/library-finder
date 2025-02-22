document.addEventListener("DOMContentLoaded", function () {
    displayLibraries();
});

// Toggle Admin Menu
function toggleAdminMenu() {
    let menu = document.getElementById("adminMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

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
                         <p>Location: ${lib.location}</p>`;
        libraryList.appendChild(div);
    });
}

// Open and Close Login Modals
function openSuperAdminLogin() {
    document.getElementById("superAdminModal").style.display = "block";
}

function closeSuperAdminLogin() {
    document.getElementById("superAdminModal").style.display = "none";
}

function openAdminLogin() {
    document.getElementById("adminModal").style.display = "block";
}

function closeAdminLogin() {
    document.getElementById("adminModal").style.display = "none";
}

// Forgot Password Functionality
function forgotPassword(userType) {
    let phone = prompt("Enter your registered Mobile Number:");
    let email = prompt("Enter your registered Email:");

    if (phone && email) {
        alert(`${userType} Password reset link sent to your email!`);
    } else {
        alert("Please enter registered Mobile Number and Email.");
    }
}