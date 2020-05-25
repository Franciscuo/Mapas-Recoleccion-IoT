const idMap = 'map-template';
const iconMarker = L.icon({
    iconUrl: '/static/images/marker.png',
    iconSize: [32, 32],
    iconAnchor: [0, 0]
});
const lineStyle = {
    "color": "#ff0000",
    "weight": 4,
    "opacity": 0.8
};

const mapURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

class Maps {
    constructor(coords) {
        this.map = L.map(idMap).setView(coords, 18);
        L.tileLayer(mapURL, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        this.markers = []
    }

    addLine() {
        L.geoJSON(freeBus, {
            style: lineStyle
        }).addTo(this.map);
    }

    addMarker(id, coords, message) {
        let marker = L.marker(coords, {
            icon: iconMarker
        })
        this.markers.push({
            id: id,
            marker: marker,
        })
        if (message) {
            marker.bindPopup(`<p>${message}</p>`).openPopup();
        }
        marker.addTo(this.map)
    }

    removeMarker(id) {
        let i = this.markers.map(function(arr) { return arr.id; }).indexOf(id);
        this.markers[i].marker.remove();
        this.markers.splice(i, 1); //delete marker to array
    }

}

let freeBus = {
    type: "FeatureCollection",
    features: []
};

const graph = new Maps([4.62805, -74.06556]);

window.onload = () => {

    let data = [];
    let path = []

    $.ajax({
        url: '/routes',
        type: 'GET',

        success: function(respuestaRutas) {
            $.ajax({
                url: '/app/node',
                type: 'GET',

                success: function(respuestaNodos) {

                    respuestaRutas.message[0].nodes.map(ruta =>
                        respuestaNodos.message.map(node => {
                            if (ruta == node._id) {
                                data.push([node.coords[0].longitude, node.coords[0].latitude])
                                graph.addMarker(`${node._id}`, [node.coords[0].latitude, node.coords[0].longitude], `${node.address}`)
                            }
                        })
                    )

                    $.ajax({
                        url: 'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
                        type: 'POST',
                        data: JSON.stringify({
                            "coordinates": data
                        }),
                        headers: {
                            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                            'Authorization': '5b3ce3597851110001cf6248a9604b31a1054d78a05f5ec1483c940e',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        dataType: 'json',
                        success: function(respuesta) {
                            path = respuesta.features[0].geometry.coordinates;
                            path.map((geo, index) => {
                                    if (index + 1 < path.length) {
                                        freeBus.features.push({
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "LineString",
                                                "coordinates": [
                                                    [path[index][0], path[index][1]],
                                                    [path[index + 1][0], path[index + 1][1]]
                                                ]
                                            },
                                            "properties": {
                                                "popupContent": "This is a free bus line that will take you across downtown.",
                                                "underConstruction": true
                                            }
                                        })

                                    }
                                })
                        },
                        error: function(e) {
                            alert(`Error ${e}`);
                        }

                    });
                },
                error: function(e) {
                    alert(`Error ${e}`);
                }

            });
        },
        error: function(e) {
            alert(`Error ${e}`);
        }

    });

    setTimeout(() => {
        graph.addLine()
    }, 3000);
};
