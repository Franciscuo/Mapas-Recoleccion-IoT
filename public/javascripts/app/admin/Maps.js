const idMap = 'map-template';
const iconContenedor = L.icon({
    iconUrl: '/static/images/contenedor_limpo.svg',
    iconSize: [32, 32],
    iconAnchor: [0, 0]
});

const iconEmpresa = L.icon({
    iconUrl: '/static/images/empresa_limpo.svg',
    iconSize: [32, 32],
    iconAnchor: [0, 0]
});

const iconParqueadero = L.icon({
    iconUrl: '/static/images/parqueadero_limpo.svg',
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

    setView(lat, lon, zoom) {
        this.map.setView([lat, lon], zoom);
    }

    addMarker(id, coords, message, n) {
        let iconoG
        if (n == 1) iconoG = iconContenedor;
        if (n == 2) iconoG = iconEmpresa;
        if (n == 3) iconoG = iconParqueadero;

        let marker = L.marker(coords, {
            icon: iconoG
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



window.onload = async() => {

    let zone = window.location.href.split('viewZones/')[1];
    let data = [];
    let path = []
    let zoneId = 0;
    let startZone;
    let endZone;
    let center;



    await $.ajax({
        url: '/zones/',
        type: 'GET',
        success: function(res) {
            res.message.map(zoneMap => {
                if (zoneMap.number == zone) {
                    zoneId = zoneMap._id;
                    startZone = zoneMap.start;
                    endZone = zoneMap.end;
                    center = zoneMap.center
                }
            })
        },
        error: function(e) {
            alert(`Error 1 ${e}`);
        }

    });




    const graph = new Maps([center[0], center[1]]);
    graph.setView(center[0], center[1], 14);





    $.ajax({
        url: '/routes',
        type: 'GET',

        success: function(respuestaRutas) {
            $.ajax({
                url: '/app/node',
                type: 'GET',

                success: function(respuestaNodos) {

                    let zoneRoutes = [];
                    respuestaRutas.message.map(route => {
                        if (route.zone === zoneId) {
                            zoneRoutes.push(route)
                        }
                    })
                    if (zoneRoutes.length == 0) {
                        alert('No hay rutas');
                        return
                    }

                    zoneRoutes[0].nodes.map(ruta =>
                        respuestaNodos.message.map(node => {
                            if (ruta == node._id) {
                                data.push([node.coords[1], node.coords[0]])
                                graph.addMarker(`${node._id}`, [node.coords[0], node.coords[1]], `${node.address}`, 1)
                            }
                        })
                    )
                    data.push([endZone[1], endZone[0]]);
                    data.splice(0, 0, [startZone[1], startZone[0]])
                    graph.addMarker(`${zoneId}${endZone}`, [endZone[0], endZone[1]], `Recoleccion`, 2)
                    graph.addMarker(`${zoneId}${startZone}`, [startZone[0], startZone[1]], `Parqueadero`, 3)
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
                            alert(`Error 1 ${e}`);
                        }

                    });
                },
                error: function(e) {
                    alert(`Error 2 ${e}`);
                }

            });
        },
        error: function(e) {
            alert(`Error 3 ${e}`);
        }

    });

    setTimeout(() => {
        graph.addLine()
    }, 3000);
};