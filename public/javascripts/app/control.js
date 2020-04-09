import Maps from './Maps.mjs'

const graph = new Maps([4.62805, -74.06556]);
var nicolas=0;
const buttonAddMarker = document.getElementById('buttonAddMarker')
const buttonRemoveMarker = document.getElementById('buttonRemoveMarker')
const buttonUpdateMap = document.getElementById('buttonUpdateMap')
const buttonRequest = document.getElementById('buttonRequest')

buttonAddMarker.addEventListener("click",() => graph.addMarker("1",[4.62805, -74.06556],"La UD"))
buttonRemoveMarker.addEventListener("click", () => graph.removeMarker("1"))
buttonRequest.addEventListener("click",async()=> {
        await fetch("https://api.openrouteservice.org/v2/directions/driving-car/json", {
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': '5b3ce3597851110001cf62486a59f3fb3ca6434aa16d328f6c788e17',
                    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
                    },
                body: JSON.stringify({
                    coordinates:[[-74.065297,4.628083],[-74.064229,4.631452],[-74.066627,4.630923]],
                }),
            })
            .then(response => response.json()).then((data) => {
                nicolas=data.routes[0].segments
                console.log(nicolas)
            })
            .catch((error) => {
                console.error('Error:', error)
            });
})
buttonUpdateMap.addEventListener("click", () => {
    graph.addLine()
})
