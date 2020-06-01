const startLatField = document.getElementById('startLat');
const startLonField = document.getElementById('startLon');
const startLatField = document.getElementById('startLat');
const endLonField = document.getElementById('endLon');
const endLatField = document.getElementById('endLat');
const zoneField = document.getElementById('zone');


const enabledInput = ()=>{
    startLonField.disabled = false;
    startLatField.disabled = false;
    endLonField.disabled = false;
    endLonField.disabled = false;
    //capacity.disabled = false;
}

const getZone = async() => {
    await fetch(`/zone/?number=${zoneField.value}`, {
        method: 'GET',
    })
    .then(response => response.json()).then((data) => {
        if (data.error) {
            console.log('Error:',data.error)
            alert("A ocurrido un problema intente mas tarde")
        }else{

        }
    })
    .catch((error) => {
        console.error('Error:', error)
    });
}

zoneField.addEventListener("change", async(event) => {

})

startLonField.addEventListener("blur", async(event) => {
    alert("efectivo")
})
endLonField.addEventListener("blur", async(event) => {
    alert("efectivo")
})
endLatField.addEventListener("blur", async(event) => {
    alert("efectivo")
})
endLonField.addEventListener("blur", async(event) => {
    alert("efectivo")
})
