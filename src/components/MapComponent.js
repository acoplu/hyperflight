// Google Haritalar API'sini yükleme
function initMap() {
    // Haritayı oluşturma
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 41.8781, lng: -87.6298 }, // Chicago koordinatları
        zoom: 8,
    });

    // Yuvarlak daire oluşturma
    const circle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        center: { lat: 41.8781, lng: -87.6298 }, // Dairenin merkezi
        radius: 50, // Yarıçapı piksel cinsinden belirtin
    });
}