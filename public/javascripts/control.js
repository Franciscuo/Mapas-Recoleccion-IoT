var map = L.map('map-template').setView([4.62805, -74.06556], 18);
const mapaURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' //Este es el mapa por defecto
const tileURL = 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png' // este es el mapa feo
const tileURL2 = 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png';


// Socket Io
const socket = io.connect('http://localhost:3000',{
    forceNew: true,
});
socket.on('message', (data) => {
    console.log(data);
});
socket.on('connected', (data) => {
    console.log(data);
});

L.tileLayer(mapaURL, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let iconMarker = L.icon({
    iconUrl: 'images/marker.png',
    iconSize: [60, 60],
    iconAnchor: [30, 60]
});

let marker = L.marker([4.62805, -74.06556], {
        icon: iconMarker
    }).addTo(map)
    .bindPopup('La UD')
    .openPopup();
// socket.emit('userCoordinates', e.latlng);