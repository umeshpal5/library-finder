// Dummy library data with pixel positions for a hypothetical map image
// These values (top, left) will need to be adjusted based on YOUR 'jaipur_map_placeholder.png' image.
// You'll need to manually figure out where each library should appear on your specific map image.
const libraries = [
    {
        id: 'lib1',
        name: 'Gyanoday Library',
        address: 'Malviya Nagar, Jaipur',
        top: '60%', // Example: 60% from top of map image
        left: '50%', // Example: 50% from left of map image
        facilities: ['AC', 'Wi-Fi', 'Comfortable Chairs', 'Silent Zone'],
        fees: '₹1500/month',
        timing: '6 AM - 11 PM',
        image: 'https://via.placeholder.com/400x200?text=Gyanoday+Library'
    },
    {
        id: 'lib2',
        name: 'Safalta Adhyayan Kendra',
        address: 'Pratap Nagar, Jaipur',
        top: '75%', // Example: 75% from top
        left: '45%', // Example: 45% from left
        facilities: ['AC', 'Wi-Fi', 'Separate Cabins', 'CCTV Security'],
        fees: '₹1800/month',
        timing: '24 Hours Open',
        image: 'https://via.placeholder.com/400x200?text=Safalta+Adhyayan'
    },
    {
        id: 'lib3',
        name: 'Pustak Dham Library',
        address: 'Raja Park, Jaipur',
        top: '40%',
        left: '65%',
        facilities: ['AC', 'Wi-Fi', 'Personal Lockers'],
        fees: '₹1200/month',
        timing: '7 AM - 10 PM',
        image: 'https://via.placeholder.com/400x200?text=Pustak+Dham'
    },
    {
        id: 'lib4',
        name: 'Sankalp Study Point',
        address: 'Vaishali Nagar, Jaipur',
        top: '55%',
        left: '20%',
        facilities: ['AC', 'Wi-Fi', 'Comfortable Seating', 'Cafeteria'],
        fees: '₹1700/month',
        timing: '8 AM - 12 AM',
        image: 'https://via.placeholder.com/400x200?text=Sankalp+Study'
    }
];

// Function to display markers on the "fake" map
function displayMapMarkers(filteredLibraries = libraries) {
    const mapMarkersContainer = document.getElementById('map-markers-container');
    if (!mapMarkersContainer) return; // Ensure element exists

    mapMarkersContainer.innerHTML = ''; // Clear existing markers

    filteredLibraries.forEach((library, index) => {
        const marker = document.createElement('div');
        marker.className = 'map-marker';
        marker.style.top = library.top;
        marker.style.left = library.left;
        marker.innerText = index + 1; // Display numbers 1, 2, 3... on markers
        marker.title = library.name; // Tooltip on hover
        marker.onclick = () => showLibraryDetail(library.id);
        mapMarkersContainer.appendChild(marker);
    });
}

// Function to handle search on map (searches dummy list and updates markers/list)
function searchLibrariesOnMap() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = libraries.filter(library =>
        library.name.toLowerCase().includes(searchTerm) ||
        library.address.toLowerCase().includes(searchTerm) ||
        library.facilities.some(fac => fac.toLowerCase().includes(searchTerm))
    );
    displayMapMarkers(filtered); // Update markers on the map
    displayLibraries(filtered); // Update the list below the map
    console.log("Searching for:", searchTerm);
}

// Function to display libraries as a list (useful for search results below map)
function displayLibraries(filteredLibraries = libraries) {
    const librariesList = document.getElementById('libraries-list-below-map');
    if (!librariesList) return;

    librariesList.innerHTML = '';

    if (filteredLibraries.length === 0) {
        librariesList.innerHTML = '<p style="text-align: center; width: 100%;">No libraries found.</p>';
        return;
    }

    filteredLibraries.forEach(library => {
        const libraryCard = document.createElement('div');
        libraryCard.className = 'library-card';
        libraryCard.onclick = () => showLibraryDetail(library.id);

        libraryCard.innerHTML = `
            <img src="${library.image}" alt="${library.name}">
            <div class="library-card-content">
                <h3>${library.name}</h3>
                <p><strong>Address:</strong> ${library.address}</p>
                <p><strong>Fees:</strong> ${library.fees}</p>
                <p><strong>Timing:</strong> ${library.timing}</p>
            </div>
        `;
        librariesList.appendChild(libraryCard);
    });
}

// Function to show library detail page
function showLibraryDetail(id) {
    localStorage.setItem('selectedLibraryId', id);
    window.location.href = 'library-detail.html';
}

// Initial load for index.html (home page)
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', () => {
        displayMapMarkers(libraries); // Display markers on the "map"
        displayLibraries(libraries); // Also display the list below the map
    });
}

// --- Library Detail Page Logic (for library-detail.html) ---
function loadLibraryDetail() {
    const selectedId = localStorage.getItem('selectedLibraryId');
    if (!selectedId) {
        alert('No library selected.');
        window.location.href = 'index.html';
        return;
    }

    const library = libraries.find(lib => lib.id === selectedId);

    if (library) {
        document.getElementById('detail-image').src = library.image;
        document.getElementById('detail-name').innerText = library.name;
        document.getElementById('detail-address').innerText = `Address: ${library.address}`;
        document.getElementById('detail-fees').innerText = `Fees: ${library.fees}`;
        document.getElementById('detail-timing').innerText = `Timing: ${library.timing}`;

        const facilitiesList = document.getElementById('detail-facilities');
        facilitiesList.innerHTML = '';
        library.facilities.forEach(facility => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${facility}</strong>`;
            facilitiesList.appendChild(li);
        });
    } else {
        alert('Library information not found.');
        window.location.href = 'index.html';
    }
}

// Call loadLibraryDetail when library-detail.html loads
if (window.location.pathname.endsWith('library-detail.html')) {
    document.addEventListener('DOMContentLoaded', loadLibraryDetail);
}
