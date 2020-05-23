const input = document.getElementById("Name");
const autoCompleteList = document.getElementById('autoCompleteList')
const advices = document.getElementsByClassName('list-group-item')
const button = document.getElementById('button');

const role = document.getElementById('role');
const userName = document.getElementById('userName');
const nameCustomer = document.getElementById('name');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const nodes = document.getElementById('nodes');
const Text = document.getElementById('Text');


const names = [];
const id = [];

const idMap = 'map-template';
const iconMarker = L.icon({
    iconUrl: '/static/images/marker.png',
    iconSize: [32, 32],
    iconAnchor: [0, 0]
});

const mapURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

class Maps {
    constructor(coords) {
        this.map = L.map(idMap).setView(coords, 18);
        L.tileLayer(mapURL, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        this.markers = []
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

    removeAllMarker() {
        let i = 0;
        while (this.markers.length > 0) {
            this.markers[i].marker.remove();
            this.markers.splice(i, 1); //delete marker to array
            i++;
        }
    }

}

const graph = new Maps([4.62805, -74.06556]);

window.onload = async() => {

    await fetch('/user/?role=client', {
            method: 'GET'
        })
        .then(response => response.json()).then((data) => {
            data.message.map(user => {
                names.push(user.name.charAt(0).toUpperCase() + user.name.slice(1))
                id.push(user._id);
                return 0
            })
        })
        .catch((error) => {
            alert('Error al cargar clientes');
            console.error('Error:', error)
        });
}

const erase = () => {
    while (autoCompleteList.firstChild) {
        autoCompleteList.firstChild.remove();
    }
}

button.addEventListener('click', () => {
    updateUser();
})

input.addEventListener("input", () => {
    erase();
    names.map(name => {
        if (name.toLowerCase().includes(input.value.toLowerCase()) && input.value.length > 0) {
            const palabra = input.value.toLowerCase();
            const index = name.toLowerCase().indexOf(palabra);
            let div = document.createElement('div');
            div.innerHTML = `
            <div class="list-group-item list-group-item-action" name='data' data-name="${name}">
            ${name.slice(0, index)}<strong>${name.slice(index, index + palabra.length)}</strong>${name.slice(index + palabra.length, name.length)}
            <input type="hidden">
            </div>
            `;
            autoCompleteList.appendChild(div);
        }
        return 0
    })

    Array.from(advices).forEach(function(element) {
        element.addEventListener('click', async(e) => {

            erase();
            input.value = element.getAttribute("data-name")
            updateUser();
        });
    });

})

$("#Name").on('keyup', function(e) {
    if (e.keyCode === 13) {
        updateUser();
        erase();
    }
});




const updateMap = (nodes) => {
    graph.removeAllMarker();
    $.ajax({
        url: '/app/node',
        type: 'GET',

        success: function(res) {
            res.message.map(node => {
                if (nodes.includes(node._id)) {
                    graph.addMarker(`${node._id}`, [node.coords[0].latitude, node.coords[0].longitude], `${node.address}`)
                }
            })
        },
        error: function(e) {
            alert(`Error ${e}`);
        }

    });
}

const updateUser = async() => {
    const indexName = names.indexOf(input.value.charAt(0).toUpperCase() + input.value.slice(1));
    if (indexName < 0) {
        role.value = 'Rol';
        email.value = 'Correo electronico';
        nameCustomer.value = 'Nombre';
        nodes.value = '#';
        userName.value = 'Usuario';
        lastName.value = 'Apellido';
        Text.innerHTML = `No se han encontrado datos que concuerden, ingrese otro nombre de cliente`;
        alert('Usuario no encontrado');
        return false;
    }
    const idCustomerNumber = id[indexName];
    const stringId = `/user/?_id=${idCustomerNumber}`
    await fetch(stringId, {
            method: 'GET'
        })
        .then(response => response.json()).then((data) => {
            const user = data.message[0];
            console.log(data.message[0])
            role.value = user.role;
            email.value = user.email;
            nameCustomer.value = user.name;
            nodes.value = user.nodes.length;
            userName.value = user.userName;
            lastName.value = user.lastName;
            Text.innerHTML = `Los datos de <strong>${user.name}</strong> han sido cargados`;
            updateMap(user.nodes);
        })
        .catch((error) => {
            alert(`
                    Error al cargar informacion de $ { input.value }
                    `);
            console.error('Error:', error)
        });
}