const propertyListElement = document.getElementById('property-list');
const propertyForm = document.getElementById('add-property-form');
document.getElementById('sortBy').addEventListener('change', handleSortChange);
document.getElementById('sortOrder').addEventListener('change', handleSortChange);

// Fetch properties from the backend when the page loads
window.onload = function () {
    fetchProperties();
};

// Function to fetch properties from the backend
function fetchProperties() {
    fetch('http://localhost:5000/api/properties')
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch properties");
            return response.json();
        })
        .then(data => {
            propertyListElement.innerHTML = ''; // Clear the existing list
            data.forEach(property => displayProperty(property)); // Render properties
        })
        .catch(error => {
            console.error('Error fetching properties:', error);
            alert('Failed to load properties. Please try again later.');
        });
}

function handleSortChange() {
    const sortBy = document.getElementById('sortBy').value;
    const sortOrder = document.getElementById('sortOrder').value;

    fetch('http://localhost:5000/api/properties')
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch properties");
            return response.json();
        })
        .then(data => {
            // Sort the fetched data
            const sortedData = data.sort((a, b) => {
                if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
                if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
                return 0;
            });

            propertyListElement.innerHTML = ''; // Clear the existing list
            sortedData.forEach(property => displayProperty(property)); // Render sorted properties
        })
        .catch(error => {
            console.error('Error fetching properties for sorting:', error);
            alert('Failed to sort properties. Please try again later.');
        });
}

// Function to display a property in the DOM
function displayProperty(property) {
    console.log("Property Data:", property);  // Log the property data to ensure correct values

    const propertyItem = document.createElement('div');
    propertyItem.classList.add('property-item');
    propertyItem.setAttribute('data-id', property._id);

    // Add image
    const propertyImageElement = document.createElement('img');

    // Check if the image URL is valid
    if (property.image && property.image.startsWith('http')) {
        propertyImageElement.src = property.image;
    } else {
        propertyImageElement.src = 'default-image.jpg'; // Fallback image if URL is not valid
    }
    
    propertyImageElement.alt = property.title || 'Property Image';  // Fallback alt text

    // Add property details
    const propertyDetails = document.createElement('div');
    propertyDetails.classList.add('property-details');

    const propertyTitle = document.createElement('h3');
    propertyTitle.textContent = property.title || 'Untitled Property'; // Fallback if title is missing

    const propertyPriceElem = document.createElement('p');
    propertyPriceElem.textContent = `Price: $${property.price || 'N/A'}`; // Fallback for missing price

    const propertyAreaElem = document.createElement('p');
    propertyAreaElem.textContent = `Area: ${property.area || 'Unknown'} sq ft`; // Fallback for missing area

    const propertyDescElem = document.createElement('p');
    propertyDescElem.textContent = `Description: ${property.description || 'No description provided'}`;

    const propertyContactElem = document.createElement('p');
    propertyContactElem.textContent = `Contact: ${property.contact || 'No contact available'}`;

    // Append details to the property container
    propertyDetails.append(propertyTitle, propertyPriceElem, propertyAreaElem, propertyDescElem, propertyContactElem);

    // Add update button
    const updateButton = document.createElement('button');
    updateButton.classList.add('update-button');
    updateButton.textContent = 'Update';
    updateButton.onclick = () => updateProperty(property); // Handle update action

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteProperty(property._id, propertyItem); // Handle delete action

    // Append the image, details, update and delete buttons to the property item
    propertyItem.append(propertyImageElement, propertyDetails, updateButton, deleteButton);

    // Append the property item to the property list container
    propertyListElement.appendChild(propertyItem);
}

// Handle Add Property Form submission
propertyForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const propertyName = document.getElementById('propertyName').value;
    const propertyPrice = document.getElementById('propertyPrice').value;
    const propertyArea = document.getElementById('propertyArea').value;
    const propertyImage = document.getElementById('propertyImage').value;
    const propertyDescription = document.getElementById('propertyDescription').value;
    const propertyContact = document.getElementById('propertyContact').value;

    // Prepare the property data to be sent to the backend
    const newProperty = {
        title: propertyName,
        description: propertyDescription, // Use user input for description
        image: propertyImage,
        contact: propertyContact,         // Use user input for contact
        price: Number(propertyPrice),
        area: Number(propertyArea)
    };

    // Send POST request to the backend
    fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty)
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to add property");
            return response.json();
        })
        .then(data => {
            fetchProperties(); // Refresh the property list
            propertyForm.reset(); // Clear the form
            console.log("Property added successfully:", data);
        })
        .catch(error => {
            console.error("Error adding property:", error);
            alert("Failed to add property. Please try again.");
        });
});

// Function to update a property
function updateProperty(property) {
    const updatedTitle = prompt("Enter new title:", property.title) || property.title;
    const updatedPrice = prompt("Enter new price:", property.price) || property.price;
    const updatedArea = prompt("Enter new area (sq ft):", property.area) || property.area;
    const updatedDescription = prompt("Enter new description:", property.description) || property.description;
    const updatedContact = prompt("Enter new contact:", property.contact) || property.contact;

    const updatedProperty = {
        title: updatedTitle,
        description: updatedDescription,
        image: property.image, // Image remains the same
        contact: updatedContact,
        price: Number(updatedPrice),
        area: Number(updatedArea)
    };

    fetch(`http://localhost:5000/api/properties/${property._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProperty)
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to update property");
            return response.json();
        })
        .then(data => {
            console.log("Property updated successfully:", data);
            fetchProperties(); // Refresh the list
        })
        .catch(error => {
            console.error("Error updating property:", error);
            alert("Failed to update property. Please try again.");
        });
}

// Function to delete a property
function deleteProperty(propertyId, propertyItem) {
    fetch(`http://localhost:5000/api/properties/${propertyId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to delete property");
            return response.json();
        })
        .then(data => {
            console.log("Property deleted successfully:", data);
            propertyItem.remove(); // Remove from DOM
        })
        .catch(error => {
            console.error("Error deleting property:", error);
            alert("Failed to delete property. Please try again.");
        });
}
