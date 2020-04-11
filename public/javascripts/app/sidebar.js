const btnSidebar = document.getElementById('btnSidebar');
const sidebar = document.getElementById('sidebar')

btnSidebar.addEventListener('click', (event) => {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
})

switch (window.location.href.split('app/')[1]) {
    case "viewNewNode":
        document.getElementById('itemAddNode').classList.add('active');
        break;
    case "viewRoutes":
        document.getElementById('itemRoutes').classList.add('active');
        break;
    case "viewClients":
        document.getElementById('itemClients').classList.add('active');
        break;
    case "viewWorkers":
        document.getElementById('itemWorkers').classList.add('active');
        break;
    default:
        document.getElementById('itemMain').classList.add('active');
        break;
}