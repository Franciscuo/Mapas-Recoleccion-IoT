let email=false;
let pass = false;
const emailField = document.getElementById('email');
const passField = document.getElementById('password');

const feedbackClient = (field,flag)=>{
    if (flag) {
        field.className = 'form-control is-valid';
    } else {
        field.className = 'form-control is-invalid';
    }
}

const isEmail = (field) => {
    return ((/[\w\._]{3,25}@[\w\.\-]{3,7}\.\w{2,5}/).test(field.value));
}

const isLoad = (field) => {
    return ((/[\w\._\$\s]{3,25}/).test(field.value));
}

emailField.addEventListener("blur",async (event)=>{
    email = isEmail(emailField);
    feedbackClient(emailField,email)
})

passField.addEventListener("blur",async (event)=>{
    pass = isLoad(passField);
    feedbackClient(passField,pass)
})

document.getElementById('btn-login-input').addEventListener('click', function(e) {
    if (!email&&!pass) {
        e.preventDefault();
    }
});