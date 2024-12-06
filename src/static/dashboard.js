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



// Función para asignar eventos a los botones
function asignarEventos() {
    // Evento para cargar planilla.html
    const botonPlanilla = document.getElementById('btnPlanilla');
    if (botonPlanilla) {
        botonPlanilla.addEventListener('click', function () {
            console.log("Botón Planilla clickeado");
            window.history.pushState({}, '', '/dashboard/planilla'); // Actualiza la URL sin recargar
            fetch('/dashboard/planilla')
                .then(response => response.text())
                .then(data => {
                    const mainContent = document.getElementById('bienvenida');
                    mainContent.innerHTML = data; // Reemplaza el contenido con planilla.html
                    asignarEventos(); // Reasignar eventos después de cargar la nueva vista
                })
                .catch(error => console.error('Error al cargar la planilla:', error));
        });
    }

    // Evento para cargar clientes.html
    const botonClientes = document.getElementById('btnClientes');
    if (botonClientes) {
        botonClientes.addEventListener('click', function () {
            console.log("Botón Clientes clickeado");
            window.history.pushState({}, '', '/dashboard/clientes'); // Actualiza la URL sin recargar
            fetch('/dashboard/clientes')
                .then(response => response.text())
                .then(data => {
                    const mainContent = document.getElementById('bienvenida');
                    mainContent.innerHTML = data; // Reemplaza el contenido con clientes.html
                    asignarEventos(); // Reasignar eventos después de cargar la nueva vista
                })
                .catch(error => console.error('Error al cargar los clientes:', error));
        });
    }
}

// Evento de carga inicial
document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('bienvenida'); // Contenedor principal del contenido dinámico

    // Delegación de eventos al cuerpo del documento
    document.body.addEventListener('click', function (event) {
        // Detectar si el botón Planilla fue clickeado
        if (event.target && event.target.id === 'btnPlanilla') {
            console.log("Botón Planilla clickeado");
            window.history.pushState({}, '', '/dashboard/planilla'); // Actualiza la URL
            fetch('/dashboard/planilla')
                .then(response => response.text())
                .then(data => {
                    mainContent.innerHTML = data; // Cargar contenido dinámico
                })
                .catch(error => console.error('Error al cargar la planilla:', error));
        }

        // Detectar si el botón Clientes fue clickeado
        else if (event.target && event.target.id === 'btnClientes') {
            console.log("Botón Clientes clickeado");
            window.history.pushState({}, '', '/dashboard/clientes'); // Actualiza la URL
            fetch('/dashboard/clientes')
                .then(response => response.text())
                .then(data => {
                    mainContent.innerHTML = data; // Cargar contenido dinámico
                })
                .catch(error => console.error('Error al cargar los clientes:', error));
        }
    });
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
                    const cliente = document.getElementById('cliente').value;
                    const telefono = document.getElementById('telefono').value;
                    const vehiculo = document.getElementById('vehiculo').value;
                    const patente = document.getElementById('patente').value;
                    const servicio = document.getElementById('servicio').value;

                    // Enviar los datos al servidor con fetch
                    fetch('/agregar_servicio', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ cliente, telefono, vehiculo, patente, servicio })
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
            const cliente = document.getElementById('cliente').value;
            const telefono = document.getElementById('telefono').value;
            const vehiculo = document.getElementById('vehiculo').value;
            const patente = document.getElementById('patente').value;
            const servicio = document.getElementById('servicio').value;

            // Enviar los datos al servidor con fetch
            fetch('/agregar_servicio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cliente, telefono, vehiculo, patente, servicio })
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

// Evento para el botón Agregar Servicio
function agregarEventoNuevoCliente() {
    setTimeout(() => { // Retrasa la búsqueda del botón para asegurar que el DOM esté listo
        const botonAgregarCliente = document.getElementById('btnAgregarCliente');
        if (botonAgregarCliente) {
            console.log("Asociando evento al botón 'Agregar Cliente'.");
            botonAgregarCliente.addEventListener('click', function() {
                console.log("Botón Agregar Cliente clickeado");
                cargarNuevoServicio(); // Carga nuevo_servicio.html
            });
        } else {
            console.error("El botón 'Agregar Cliente' no se encontró en el DOM.");
        }
    }, 100); // Retraso de 100ms para asegurarte de que el DOM se haya actualizado
}