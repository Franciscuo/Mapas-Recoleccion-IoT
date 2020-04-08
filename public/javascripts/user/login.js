let email=false;
const emailField = document.getElementById('email');

const feedbackClient = (field,flag)=>{
    if (flag) {
        field.className = 'form-control is-valid';
    } else {
        field.className = 'form-control is-invalid';
    }
} 

emailField.addEventListener("blur",async (event)=>{
    email = isLoad(emailField);
    feedbackClient(emailField,email)
})

document.getElementById('btn-login-input').addEventListener('click', function(e) {
    if (!email) {
        e.preventDefault();
    }
});