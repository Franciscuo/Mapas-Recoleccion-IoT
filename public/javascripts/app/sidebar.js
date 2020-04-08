
const btnSidebar = document.getElementById('btnSidebar');
const sidebar = document.getElementById('sidebar')
btnSidebar.addEventListener('click', (event) => {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
})

