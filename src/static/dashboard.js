console.log("Archivo JavaScript cargado");

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
const autito = document.getElementById("autito");
const barraLateral = document.querySelector('.barra-lateral');
const spans = document.querySelectorAll('span');
const main = document.querySelector('main');
const topbar = document.querySelector('header.navbar');

autito.addEventListener("click", () => {
    barraLateral.classList.toggle('mini-barra-lateral');
    main.classList.toggle('min-main');
    topbar.classList.toggle('min');
    
    spans.forEach((span) =>{
        span.classList.toggle('oculto');
    });
});     

//Evento click planilla para mostrar contenido

// Evento de carga del documento
document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('bienvenida');
    
    // Evento para cargar planilla.html
    const botonPlanilla = document.getElementById('btnPlanilla');
    if (botonPlanilla) {
        botonPlanilla.addEventListener('click', function() {
            console.log("Botón Planilla clickeado");
            window.history.pushState({}, '', '/dashboard/planilla'); // Actualiza la URL sin recargar
            fetch('/dashboard/planilla')
                .then(response => response.text())
                .then(data => {
                    console.log("Datos recibidos:", data);
                    mainContent.innerHTML = data; // Reemplaza el contenido con planilla.html
                    agregarEventoNuevoServicio(); // Añade el evento para btnAgregarServicio después de cargar planilla
                })
                .catch(error => console.error('Error al cargar la planilla:', error));
        });
    }
});

// Función para agregar el evento al botón Agregar Servicio
// Evento para el botón Agregar Servicio
function agregarEventoNuevoServicio() {
    setTimeout(() => { // Retrasa la búsqueda del botón para asegurar que el DOM esté listo
        const botonAgregarServicio = document.getElementById('btnAgregarServicio');
        if (botonAgregarServicio) {
            console.log("Asociando evento al botón 'Agregar Servicio'.");
            botonAgregarServicio.addEventListener('click', function() {
                console.log("Botón Agregar Servicio clickeado");
                cargarNuevoServicio(); // Carga nuevo_servicio.html
            });
        } else {
            console.error("El botón 'Agregar Servicio' no se encontró en el DOM.");
        }
    }, 100); // Retraso de 100ms para asegurarte de que el DOM se haya actualizado
}

// Función para cargar nuevo_servicio.html y configurar eventos
function cargarNuevoServicio() {
    fetch('/dashboard/nuevo_servicio')
        .then(response => response.text())
        .then(data => {
            const mainContent = document.getElementById('bienvenida');
            mainContent.innerHTML = data; // Reemplaza el contenido con nuevo_servicio.html
            
            // Configurar eventos para los botones dentro de nuevo_servicio.html
            const btnAceptar = document.getElementById('btnAceptar');
            const btnCancelar = document.getElementById('btnCancelar');

            if (btnAceptar) {
                btnAceptar.addEventListener('click', function(event) {
                    event.preventDefault(); // Evita el envío por defecto del formulario

                    // Recoger los datos del formulario
                    const nombre = document.getElementById('nombre').value;
                    const precio = document.getElementById('precio').value;

                    // Enviar los datos al servidor con fetch
                    fetch('/agregar_servicio', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ nombre, precio })
                    })
                    .then(response => {
                        if (response.ok) {
                            // Recargar planilla dentro de dashboard
                            fetch('/dashboard/planilla')
                                .then(response => response.text())
                                .then(data => {
                                    mainContent.innerHTML = data; // Reemplaza contenido de main con planilla.html
                                })
                                .catch(error => console.error('Error al recargar planilla:', error));
                        } else {
                            console.error('Error al agregar el servicio:', response.statusText);
                        }
                    })
                    .catch(error => console.error('Error en la solicitud:', error));
                });
            }

            if (btnCancelar) {
                btnCancelar.addEventListener('click', function() {
                    // Redirigir a la planilla
                    fetch('/dashboard/planilla')
                        .then(response => response.text())
                        .then(data => {
                            mainContent.innerHTML = data; // Reemplaza contenido de main con planilla.html
                        })
                        .catch(error => console.error('Error al recargar planilla:', error));
                });
            }
        })
        .catch(error => console.error('Error al cargar el formulario de servicio:', error));
}

// Función para configurar eventos de nuevo_servicio.html
function configurarEventosNuevoServicio() {
    const btnAceptar = document.getElementById('btnAceptar');
    const btnCancelar = document.getElementById('btnCancelar');

    if (btnAceptar) {
        btnAceptar.addEventListener('click', function(event) {
            event.preventDefault(); // Evita el envío por defecto del formulario

            // Recoger los datos del formulario
            const nombre = document.getElementById('nombre').value;
            const precio = document.getElementById('precio').value;

            // Enviar los datos al servidor con fetch
            fetch('/agregar_servicio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, precio })
            })
            .then(response => {
                if (response.ok) {
                    // Recargar planilla dentro de dashboard
                    fetch('/dashboard/planilla')
                        .then(response => response.text())
                        .then(data => {
                            const mainContent = document.getElementById('bienvenida');
                            mainContent.innerHTML = data; // Reemplaza contenido de main con planilla.html
                        })
                        .catch(error => console.error('Error al recargar planilla:', error));
                } else {
                    console.error('Error al agregar el servicio:', response.statusText);
                }
            })
            .catch(error => console.error('Error en la solicitud:', error));
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', function() {
            // Redirigir a la planilla
            fetch('/dashboard/planilla')
                .then(response => response.text())
                .then(data => {
                    const mainContent = document.getElementById('bienvenida');
                    mainContent.innerHTML = data; // Reemplaza contenido de main con planilla.html
                })
                .catch(error => console.error('Error al recargar planilla:', error));
        });
    }
}

function recargarPlanilla() {
    fetch('/dashboard/planilla')
        .then(response => response.text())
        .then(data => {
            const mainContent = document.getElementById('bienvenida');
            mainContent.innerHTML = data; // Reemplaza contenido de main con planilla.html

            // Asegúrate de que el DOM esté listo antes de agregar eventos
            agregarEventoNuevoServicio();
        })
        .catch(error => console.error('Error al recargar planilla:', error));
}

document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btnAgregarServicio') {
        console.log("Botón Agregar Servicio clickeado");
        cargarNuevoServicio(); // Carga nuevo_servicio.html
    }
});


//const sidebar = document.querySelector('.sidebar');
//const toggleButton = document.getElementById('toggleButton');

//toggleButton.addEventListener('click', () => {
//    sidebar.classList.toggle('minimized');
 //   toggleButton.textContent = sidebar.classList.contains('minimized') ? '⮜' : '⮞';
//});

// Mostrar sección de Planilla
//function showPlanilla() {
//    document.getElementById('mainContent').style.display = 'none';
//    document.getElementById('planillaSection').style.display = 'block';
//}
