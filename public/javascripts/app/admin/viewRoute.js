const zone = document.getElementById('zone');
const btnSubmit = document.getElementById('btnSubmit');

btnSubmit.addEventListener("click", async(event) => {
        await fetch("/iot/routes", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    zone: zone.value,
                }),
            })
            .then(response => response.json()).then((data) => {
                if (!data.error) {
                    console.log(data)
                } else {
                    alert(data.error);
                }
            })
            .catch((error) => {
                console.error('Error:', error)
            });
})