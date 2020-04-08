
const sidebarCollapse = document.getElementById('sidebarCollapse');
const sidebar = document.getElementById('sidebar')
sidebarCollapse.click = () => {
    sidebar.toggleClass('active');
    sidebarCollapse.toggleClass('active');
}

