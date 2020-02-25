$('#user').blur(function() {

    const field = document.getElementById('user');
    if (field.value == '' || field.value == undefined) {
        field.className = 'form-control is-invalid';
    } else {
        field.className = 'form-control is-valid';
    }
});

$('#name').blur(function() {

    const field = document.getElementById('name');
    if (field.value == '' || field.value == undefined) {
        field.className = 'form-control is-invalid';
    } else {
        field.className = 'form-control is-valid';
    }
});


$('#lastName').blur(function() {

    const field = document.getElementById('lastName');
    if (field.value == '' || field.value == undefined) {
        field.className = 'form-control is-invalid';
    } else {
        field.className = 'form-control is-valid';
    }
});

$('#email').blur(function() {
    const field = document.getElementById('email');
    fieldValue = field.value;
    if (fieldValue == '' || fieldValue == undefined) {
        field.className = 'form-control is-invalid';
    } else {
        if (fieldValue.includes('@') && fieldValue.includes('.')) {
            field.className = 'form-control is-valid';
        } else {
            field.className = 'form-control is-invalid';
        }
    }
});

function passField() {
    const field = document.getElementById('password');
    if (field.value.length < 8) {
        field.className = 'form-control is-invalid';
    } else {
        field.className = 'form-control is-valid';
    }
}

$('#password').blur(function() {
    passField();
});

function passConfirmField() {
    const field = document.getElementById('confirmPassword');
    const field2 = document.getElementById('password');
    if (field.value == field2.value) {
        if (field.value.length < 8) {
            field.className = 'form-control is-invalid';
        } else {
            field.className = 'form-control is-valid';
        }
    } else {
        field.className = 'form-control is-invalid';
    }
}

$('#confirmPassword').blur(function() {
    passConfirmField();
});