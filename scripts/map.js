var pinData = [];
var completedURLS = [];
var places = [];

fetch('https://script.google.com/macros/s/AKfycbw9ztYFLV_Fl8_UAsj2joF26XAQgw5CND4fo2JlKQgbHY7pnAzAeW_J2A3rzwKWiNoG/exec')
.then(res => res.json())
.then(data => {
    places = data.columnH;
    pinData = data.columnL;

    addPins();
})
.catch(error => alert(error))

var southWest = L.latLng(-180, 180); // South-west corner
var northEast = L.latLng(180, -180); // North-east corner
var bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
    maxBounds: bounds, // Set the max bounds
    maxBoundsViscosity: 1.0, // Optional: makes the bounds more "sticky"
    minZoom: 1.09,
}).setView([40,0], 1.1);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function addPins() {
    for(i = 0; i < pinData.length; i++) {
        if(!completedURLS.includes(pinData[i])) {
            completedURLS.push(pinData[i])
    
            let coords = pinData[i].split('=')[1];
            let lat = coords.split(',')[0];
            let long = coords.split(',')[1];
        
            L.marker([lat, long])
            .bindPopup(places[i])
            .addTo(map)
        }
    }
    
}