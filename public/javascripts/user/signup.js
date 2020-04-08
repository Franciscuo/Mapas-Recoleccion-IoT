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

const isLoad = (field) => {
    return ((field.value != '') && (field.value != undefined))
}

const isComplete = (field) => {
    return (field.value.length < 8)
}

const isEmail = (field) => {
    return (field.value.includes('@') && field.value.includes('.'))

}

const isPass = (field) => {
    return (field.value.length > 8)
}

userField.addEventListener("blur",async (event)=>{
    if(isLoad(userField)){
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
    name = isLoad(nameField);
    feedbackClient(nameField,name)
})

lastNameField.addEventListener("blur", (event) => {
    lastName = isLoad(lastNameField);
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

confirmPasswordField.addEventListener("blur",(event) => {
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
