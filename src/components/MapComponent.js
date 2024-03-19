// src/components/MapComponent.js
function initMap() {
    // Haritayı oluşturma
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 41.8781, lng: -87.6298 }, // Default center coordinates (e.g., Chicago)
        zoom: 8,
    });

    // Create a marker for the plane's position
    const planeMarker = new google.maps.Marker({
        position: { lat: 41.8781, lng: -87.6298 }, // Default position (e.g., Chicago)
        map: map,
        icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // Use a forward arrow as the icon
            scale: 5, // Set the size of the arrow
            fillColor: "#FF0000", // Set the color of the arrow
            fillOpacity: 1, // Set the opacity of the arrow
            strokeWeight: 1, // Set the weight of the arrow's outline
            rotation: 0, // Set the rotation angle of the arrow (in degrees)
        },
        title: "Plane", // Tooltip text for the marker
    });
} 