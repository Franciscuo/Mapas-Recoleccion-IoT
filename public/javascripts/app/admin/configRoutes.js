const startLatField = document.getElementById('startLat');
const startLonField = document.getElementById('startLon');
const centerLonField = document.getElementById('centerLon');
const centerLatField = document.getElementById('centerLat');
const endLonField = document.getElementById('endLon');
const endLatField = document.getElementById('endLat');
const zoneField = document.getElementById('zone');
const capacityField = document.getElementById('capacity');
const btnEdit = document.getElementById('btnEdit');
const change = false;


const changeInputs = async () => {
    if(!change) {
        btnEdit.disabled = false;
        change = true;
    }
}

const enabledInput = ()=>{
    startLonField.disabled = false;
    startLatField.disabled = false;
    endLonField.disabled = false;
    endLatField.disabled = false;
    centerLonField.disabled = false;
    centerLatField.disabled = false;
    capacityField.disabled = false;
    startLatField.addEventListener("change",changeInputs);
    startLonField.addEventListener("change",changeInputs);
    centerLatField.addEventListener("change",changeInputs);
    endLonField.addEventListener("change",changeInputs);
    centerLatField.addEventListener("change",changeInputs);
    centerLonField.addEventListener("change",changeInputs);
    capacityField.addEventListener("change",changeInputs);
}

const getZone = async() => {
    await fetch(`/zones/?number=${zoneField.value}`, {
        method: 'GET',
    })
    .then(response => response.json()).then((data) => {
        if (data.error) {
            console.log('Error:',data.error)
            alert("A ocurrido un problema intente mas tarde")
        }else{
            startLatField.value = data.message[0].start[0];
            startLonField.value = data.message[0].start[1];
            endLatField.value = data.message[0].end[0];
            endLonField.value = data.message[0].end[1];
            centerLatField.value = data.message[0].center[0];
            centerLonField.value = data.message[0].center[1];
            capacityField.value = data.message[0].capacity;
        }
    })
    .catch((error) => {
        console.error('Error:', error)
    });
}

zoneField.addEventListener("change", async(event) => {
    await getZone();
    enabledInput();
})

btnEdit.addEventListener("click", async(event) => {
    alert("Hola");
})

