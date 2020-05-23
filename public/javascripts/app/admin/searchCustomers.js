const input = document.getElementById("Name");
const autoCompleteList = document.getElementById('autoCompleteList')
const advices = document.getElementsByClassName('list-group-item')

const names = [];

window.onload = async() => {
    await fetch('/user/?role=client', {
            method: 'GET'
        })
        .then(response => response.json()).then((data) => {
            data.message.map(user => {
                if (user.role === 'client') {
                    names.push(user.name.charAt(0).toUpperCase() + user.name.slice(1))
                }
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

input.addEventListener("input", () => {
    erase();
    names.map(name => {
        if (name.toLowerCase().includes(input.value.toLowerCase()) && input.value.length > 0) {
            const palabra = input.value.toLowerCase();
            const index = name.toLowerCase().indexOf(palabra);
            let div = document.createElement('div');
            div.innerHTML = `
            <div class="list-group-item list-group-item-action" data-name="${name}">
            ${name.slice(0, index)}<strong>${name.slice(index, index + palabra.length)}</strong>${name.slice(index + palabra.length, name.length)}
            <input type="hidden">
            </div>
            `;
            autoCompleteList.appendChild(div);
        }
        return 0
    })

    Array.from(advices).forEach(function(element) {
        element.addEventListener('click', () => {
            erase();
            input.value = element.getAttribute("data-name");
        });
    });

})