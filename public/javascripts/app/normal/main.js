let dir
const btnSend = document.getElementById('btnSend');
const euiField = document.getElementById('eui')
const passField = document.getElementById('pass')
const dirField = document.getElementById('address')
const zoneField = document.getElementById('zone')
const lonField = document.getElementById('lon')
const latField = document.getElementById('lat')

const feedbackClient = (field,flag)=>{
    if (flag) {
        field.className = 'form-control is-valid';
    } else {
        field.className = 'form-control is-invalid';
    }
} 

const isComplete = (field) => {
    return ((field.value.includes('C') )&& (field.value.length > 8))
}

dirField.addEventListener("blur", async (event) => {
    dir = isComplete(dirField);
    feedbackClient(dirField,dir)
})

btnSend.addEventListener("click", async(event) => {
    if (dir) {
        await fetch("/user/syncNode", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eui: euiField.value,
                    pass: passField.value,
                    address: dirField.value,
                    zone: zoneField.value,
                    lat: latField.value,
                    lon: lonField.value,
                }),
            })
            .then(response => response.json()).then((data) => {
                if (!data.error) {
                    alert("Registro Exitoso");
                    location.href="/app";
                } else {
                    alert(data.error);
                }
            })
            .catch((error) => {
                console.error('Error:', error)
            });
    } else {
        alert('Faltan Campos');
    }
})