import Maps from './Maps.mjs'

const graph = new Maps([4.62805, -74.06556]);

const buttonAddMarker = document.getElementById('buttonAddMarker')
const buttonRemoveMarker = document.getElementById('buttonRemoveMarker')
buttonAddMarker.addEventListener("click",() => graph.addMarker("1",[4.62805, -74.06556],"La UD"))
buttonRemoveMarker.addEventListener("click", () => graph.removeMarker("1"))

