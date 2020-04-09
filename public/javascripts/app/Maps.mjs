const idMap = 'map-template';
const iconMarker = L.icon({
  iconUrl: '/static/images/marker.png',
  iconSize: [32, 32],
  iconAnchor: [0, 0]
});
const lineStyle = {
  "color": "#ff0000",
  "weight": 6,
  "opacity": 1
};
const freeBus = {
  "type": "FeatureCollection",
  "features": [
      {
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": [
                  [-74.065297, 4.628083],
                  [-74.064229,4.631452]
              ]
          },
          "properties": {
              "popupContent": "This is a free bus line that will take you across downtown.",
              "underConstruction": false
          },
          "id": 1
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": [
                  [-74.064229, 4.631452],
                  [-74.066337, 4.632238]
              ]
          },
          "properties": {
              "popupContent": "This is a free bus line that will take you across downtown.",
              "underConstruction": true
          },
          "id": 2
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": [
                  [-74.066337, 4.632238],
                  [-74.066627, 4.630923]
              ]
          },
          "properties": {
              "popupContent": "This is a free bus line that will take you across downtown.",
              "underConstruction": false
          },
          "id": 3
      }
  ]
};

const mapURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' //Map for default
//const mapURL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //Map for default

class Maps{
    constructor(coords) {
      this.map = L.map(idMap).setView(coords, 18);
      L.tileLayer(mapURL, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      this.markers=[]
    }

    addLine(){
      L.geoJSON(freeBus, {
          style: lineStyle
      }).addTo(this.map);
    }

    addMarker(id,coords,message){
      let marker=L.marker(coords, {
        icon: iconMarker
      })
      this.markers.push({
          id:id,
          marker: marker,
      })      
      if(message){
        marker.bindPopup(`<p>${message}</p>`).openPopup();
      }
      marker.addTo(this.map)
    }

    removeMarker(id){
      let i = this.markers.map(function(arr) { return arr.id; }).indexOf(id);
      this.markers[i].marker.remove();
      this.markers.splice( i, 1 );//delete marker to array
    }
    
}
  
export default Maps;