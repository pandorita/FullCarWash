function updateDateTime() {
    const dateTimeElement = document.getElementById("dateTime");
    const now = new Date();
    const options = { dateStyle: "full", timeStyle: "medium" };
    dateTimeElement.textContent = now.toLocaleString("es-ES", options);
}

// Actualizar cada segundo
setInterval(updateDateTime, 1000);
updateDateTime();  // Llamada inicial

// Minimizar y expandir la barra lateral
const sidebar = document.querySelector('.sidebar');
const toggleButton = document.getElementById('toggleButton');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('minimized');
    toggleButton.textContent = sidebar.classList.contains('minimized') ? '⮜' : '⮞';
});

// Mostrar sección de Planilla
function showPlanilla() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('planillaSection').style.display = 'block';
}
