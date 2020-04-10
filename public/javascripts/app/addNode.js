const eui = document.getElementById('eui');
const model = document.getElementById('model');
const btnSubmit = document.getElementById('btnSubmit');

btnSubmit.addEventListener("click", async(event) => {
    if (eui) {
        await fetch("/app/node", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eui: eui.value,
                    model: model.value
                }),
            })
            .then(response => response.json()).then((data) => {
                if (!data.error) {
                    alert("Registro Exitoso");
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

eui.addEventListener("blur", async(event) => {
    if (eui) {
        await fetch(`/app/node?eui=${eui.value}`, {
                method: "GET"
            })
            .then(response => response.json()).then((data) => {
                const aux = data.message[0]
                if (!aux) {
                    eui.className = 'form-control';
                } else {
                    eui.className = 'form-control is-invalid';
                }
            })
            .catch((error) => {
                console.error('Error:', error)
            });
    } else {
        alert('Faltan Campos');
    }
})