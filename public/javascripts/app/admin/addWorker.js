let userName = false;
let name = false;
let lastName = false;
let email = false;
let zone = false;

const userField = document.getElementById('user');
const nameField = document.getElementById('name');
const lastNameField = document.getElementById('lastName');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const zoneField = document.getElementById('zone');
const sendBtn = document.getElementById('btnSend');

const feedbackClient = (field, flag) => {
    if (flag) {
        field.className = 'form-control is-valid';
    } else {
        field.className = 'form-control is-invalid';
    }
}

const verifyEmail = async() =>{
    await fetch('/user/email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailField.value }),
    })
    .then(response => response.json()).then((data) => {
        email = !data.message;
        if (!email) {
            alert("Correo ya registrado")
        }
    })
    .catch((error) => {
        email = false;
        console.error('Error:', error)
    });
}

const verifyUser = async() =>{
    await fetch('/user/username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: userField.value }),
    })
    .then(response => response.json()).then((data) => {
        userName = !data.message;
        if (!userName) {
            alert("User ya registrado")
            userName = false;
        }else{
            userName = true;
        }
    })
    .catch((error) => {
        userName = false;
        console.error('Error:', error)
    });
}

const isName = (field) => {
    return ((/^([A-Z\u00d1]{1,1}[a-záéíóú\u00f1]{2,12})[\s]?([A-Z\u00d1]?[a-z\u00d1]{2,12})?$/).test(field.value))
}

const isUserName = (field) => {
    return ((/^[a-z\u00f1\u00d1]+[^A-Z\s%$@\^]{2,25}$/).test(field.value))
}

const isEmail = (field) => {
    return ((/^[\u00f1\u00d1\w\._\-]{3,25}@[\w\.\-]{3,30}\.\w{2,5}$/).test(field.value))
}

const fillUserName = async() =>{
    if(!userField.value){
        const nameFirth = nameField.value;
        const nameSecond = lastNameField.value;
        userField.value = `${nameFirth.replace(/\s/, '').toLocaleLowerCase()}${nameSecond.replace(/\s/, '').toLocaleLowerCase()}`;
        await verifyUser();
        feedbackClient(userField, userName)
    }
}

userField.addEventListener("blur", async(event) => {
    if (isUserName(userField)) {
        await verifyUser();
    } else {
        userName = false;
    }
    feedbackClient(userField, userName)
})

emailField.addEventListener("blur", async(event) => {
    if (isEmail(emailField)) {
        await verifyEmail();
    } else {
        email = false;
    }
    feedbackClient(emailField, email)
})

nameField.addEventListener("blur", async(event) => {
    name = isName(nameField);
    feedbackClient(nameField, name)
})

lastNameField.addEventListener("blur", (event) => {
    lastName = isName(lastNameField);
    feedbackClient(lastNameField, lastName)
    fillUserName();
});

sendBtn.addEventListener("click", async(event) => {

    zone=!(!(zoneField.value));
    if (userName && name && lastName && email && zone) {

        const dataForm = {
            userName: userField.value,
            name: nameField.value,
            lastName: lastNameField.value,
            email: emailField.value,
            zone:zoneField.value
        }
        await fetch("/user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataForm),
            })
            .then(response => response.json()).then((data) => {
                if (!data.error) {
                    alert("Registro Exitoso")
                } else {
                    alert(data.error)
                }
            })
            .catch((error) => {
                console.error('Error:', error)
            });
    } else {
        alert('Faltan Campos');
    }
})