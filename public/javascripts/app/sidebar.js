const btnSidebar = document.getElementById('btnSidebar');
const sidebar = document.getElementById('sidebar')

btnSidebar.addEventListener('click', (event) => {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
})

const URLactual = window.location.href;
console.log(URLactual.split('app/')[1].toString());
switch (URLactual.split('app/')[1]) {
    case "newNode":
        document.getElementById('itemAddNode').classList.add('active');
    default:
        document.getElementById('itemMain').classList.add('active');
        break;
}