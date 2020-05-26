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



    await $.ajax({ // Peticion para obtener datos de la zona
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
    graph.setView(center[0], center[1], 14); // Centra el mapa con base en la zona


    let respuestaRutas = 0;
    let respuestaNodos = 0;

    await $.ajax({ // Peticion para obtener las rutas
        url: '/routes',
        type: 'GET',

        success: function(res) {
            respuestaRutas = res;
        },
        error: function(e) {
            alert(`Error 3 ${e}`);
        }

    });

    await $.ajax({ // Peticion para obtener los nodos
        url: '/app/node',
        type: 'GET',

        success: function(res2) {
            respuestaNodos = res2;
        },
        error: function(e) {
            alert(`Error 2 ${e}`);
        }

    });


    let zoneRoutes = 0;
    respuestaRutas.message.map(route => { // Busca entre las rutas obtenidas una para la zona actual
        if (route.zone === zoneId) {
            zoneRoutes = route
        }
    })
    if (zoneRoutes === 0) {
        alert('No hay rutas');
        return
    }

    zoneRoutes.nodes.map(ruta => // Arma la lista de nodos para la zona
        respuestaNodos.message.map(node => {
            if (ruta == node._id) {
                data.push([node.coords[1], node.coords[0]])
                graph.addMarker(`${node._id}`, [node.coords[0], node.coords[1]], `${node.address}`, 1)
            }
        })
    )

    data.push([endZone[1], endZone[0]]); //Añade puntos de inicio y fin
    data.splice(0, 0, [startZone[1], startZone[0]])
    graph.addMarker(`${zoneId}${endZone}`, [endZone[0], endZone[1]], `Recoleccion`, 2)
    graph.addMarker(`${zoneId}${startZone}`, [startZone[0], startZone[1]], `Parqueadero`, 3)


    let segments = 0;
    let summary = 0;

    await $.ajax({ // Peticion para obtener ruta optimizada
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
            segments = respuesta.features[0].properties.segments
            summary = respuesta.features[0].properties.summary
            path = respuesta.features[0].geometry.coordinates;
        },
        error: function(e) {
            alert(`Error 1 ${e}`);
        }

    });


    path.map((geo, index) => { // Se arma el vector de dibujo
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

    console.log(summary)
    const routeList = document.getElementById('routeList')
    const gMin = document.getElementById('g-min')
    const gKm = document.getElementById('g-km')

    let div = document.createElement('div');
    div.innerHTML = `
    <div class="list-group-item list-group-item-action bg-success text-white">
    Inicio desde estación 
    <input type="hidden">
    </div>
    `;
    routeList.appendChild(div);
    segments.map((segment, sIndex) => {
        if (sIndex > 0) {
            let div = document.createElement('div');
            div.innerHTML = `
        <div class="list-group-item list-group-item-action bg-success text-white">
        Parada numero ${sIndex}
        <input type="hidden">
        </div>
        `;
            routeList.appendChild(div);
        }
        segment.steps.map(step => {
            let div = document.createElement('div');
            div.innerHTML = `
            <div class="list-group-item list-group-item-action" >
            ${step.instruction}<br>
            <strong>Duración:</strong> ${step.duration} seg <strong>Distancia:</strong> ${step.distance} mts
            <input type="hidden">
            </div>
            `;
            routeList.appendChild(div);
        })
    })

    let div2 = document.createElement('div');
    div2.innerHTML = `
    <div class="list-group-item list-group-item-action bg-success text-white">
    Llegada al centro de recolección
    <input type="hidden">
    </div>
    `;
    routeList.appendChild(div2);

    gMin.innerHTML = ` ${summary.duration/60} Min`;
    gKm.innerHTML = ` ${summary.distance/1000} Km`



    setTimeout(() => {
        graph.addLine()
    }, 3000);
};