let email=false;
const emailField = document.getElementById('email');



const feedbackClient = (field,flag)=>{
    if (flag) {
        field.className = 'form-control is-valid';
    } else {
        field.className = 'form-control is-invalid';
    }
} 

const isEmail = (field) => {
    return (field.value.includes('@') && field.value.includes('.'))

}

emailField.addEventListener("blur",async (event)=>{
    email = isEmail(emailField);
    feedbackClient(emailField,email)
})

document.getElementById('btn-login-input').addEventListener('click', function(e) {
    if (!email) {
        e.preventDefault();
    }
});