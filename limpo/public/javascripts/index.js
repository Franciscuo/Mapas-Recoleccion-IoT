var map = L.map('map-template').setView([4.62805,-74.06556], 18);
const mapaURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'//Este es el mapa por defecto
const tileURL = 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png' // este es el mapa feo
const tileURL2 = 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png';
//const socket = io.connect();

L.tileLayer(mapaURL, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([4.62805,-74.06556]).addTo(map)
    .bindPopup('La UD')
    .openPopup();
/*
var map = L.map('map-template').setView([51.505, -0.09], 3);

const tileURL = 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png' 
const tileURL2 = 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png';

const tile = L.tileLayer(tileURL2);

// Socket Io
const socket = io.connect();

// Marker
const marker = L.marker([50.5, 30.5]); // kiev, ukraine
marker.bindPopup('Hello There!');
map.addLayer(marker);

// Geolocation
map.locate({enableHighAccuracy: true})
map.on('locationfound', (e) => {
  const coords = [e.latlng.lat, e.latlng.lng];
  const newMarker = L.marker(coords);
  newMarker.bindPopup('You are Here!');
  map.addLayer(newMarker);
  socket.emit('userCoordinates', e.latlng);
});*/