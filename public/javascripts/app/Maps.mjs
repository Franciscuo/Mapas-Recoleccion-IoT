const idMap = 'map-template';
const iconMarker = L.icon({
  iconUrl: '/static/images/marker.png',
  iconSize: [32, 32],
  iconAnchor: [0, 0]
});

const mapURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' //Map for default

class Maps{
    constructor(coords) {
      this.map = L.map(idMap).setView(coords, 18);
      L.tileLayer(mapURL, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      this.markers=[]
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