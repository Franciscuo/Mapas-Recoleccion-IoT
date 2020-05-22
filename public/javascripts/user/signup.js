let userName=false;
let name=false;
let lastName=false;
let email=false;
let password=false;
let confirmPassword=false;

const form = document.getElementById('signUp-form');
const userField = document.getElementById('user');
const nameField = document.getElementById('name');
const lastNameField = document.getElementById('lastName');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const confirmPasswordField = document.getElementById('confirmPassword');
const sendBtn = document.getElementById('btnSend');

const feedbackClient = (field,flag)=>{
    if (flag) {
        field.className = 'form-control is-valid';
    } else {
        field.className = 'form-control is-invalid';
    }
}

const isName = (field) => {
    return ((/^([A-Z]{1,1}[a-záéíóú]{2,12}?){3,16}$/).test(field.value))
}

const isUserName = (field) => {
    return ((/^[a-z]+[^A-Z\s%$@\^]{5,16}$/).test(field.value))
}

const isEmail = (field) => {
    return ((/^[\w\._]{3,25}@[\w\.\-]{3,7}\.\w{2,5}$/).test(field.value))
}

const isPass = (field) => {
    return ((/^(?=\w*\d+)(?=\w*[A-Z]+)(?=\w*[a-z]+)\S{8,16}$/).test(field.value))
}

userField.addEventListener("blur",async (event)=>{
    if(isUserName(userField)){
        await fetch('/user/username', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify({user: userField.value}),
                })
                .then(response => response.json()).then((data) => {
                    userName=!data.message;
                    if(!userName){
                        alert("User ya registrado")
                    }
                })
                .catch((error) => {
                    userName=false;
                    console.error('Error:', error)
                });
    }else{
        userName=false;
    }
    feedbackClient(userField,userName)

})

nameField.addEventListener("blur", async (event) => {
    name = isName(nameField);
    feedbackClient(nameField,name)
})

lastNameField.addEventListener("blur", (event) => {
    lastName = isName(lastNameField);
    feedbackClient(lastNameField,lastName)
});

emailField.addEventListener("blur",async (event)=>{
    if(isEmail(emailField)){
        await fetch('/user/email', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify({email: emailField.value}),
                })
                .then(response => response.json()).then((data) => {
                    email=!data.message;
                    if(!email){
                        alert("Correo ya registrado")
                    }
                })
                .catch((error) => {
                    email=false;
                    console.error('Error:', error)
                });
    }else{
        email=false;
    }
    feedbackClient(emailField,email)

})

passwordField.addEventListener("blur", (event)=>{
    password = isPass(passwordField)
    feedbackClient(passwordField,password)
})

confirmPasswordField.addEventListener("keyup",(event) => {
    confirmPassword = (passwordField.value == confirmPasswordField.value);
    feedbackClient(confirmPasswordField,confirmPassword)
})

sendBtn.addEventListener("click",async (event) => {
    if (user && name && lastName && email && password && confirmPassword) {
        await fetch("/user", {
                method: "POST",
                headers:{
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify({
                    userName: userField.value,
                    name: nameField.value,
                    lastName: lastNameField.value,
                    email: emailField.value,
                    password: passwordField.value,
                }),
            })
            .then(response => response.json()).then((data) => {
                if(!data.error){
                    alert("Registro Exitoso")
                    location.href="/login";
                }else{
                    alert(data.error)
                }
            })
            .catch((error) => {
                console.error('Error:', error)
            });
    }else{
        alert('Faltan Campos');
    }
})
