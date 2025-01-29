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

// Función para asignar eventos a los botones
function asignarEventos() {
    // Evento para cargar planilla.html
    const botonPlanilla = document.getElementById('btnPlanilla');
    if (botonPlanilla) {
        botonPlanilla.addEventListener('click', function () {
            if (!evitarRecargaSiEnPestañaActual('/dashboard/planilla')) {
                console.log("Botón Planilla clickeado");
                window.history.pushState({}, '', '/dashboard/planilla');
                
                // Obtener fecha actual en formato YYYY-MM-DD
                const hoy = new Date();
                const fechaActual = hoy.toISOString().split('T')[0];
                
                // Realizar el filtrado automático
                fetch(`/dashboard/filtrar_servicios?fecha=${fechaActual}`)
                    .then(response => response.text())
                    .then(data => {
                        const mainContent = document.getElementById('bienvenida');
                        mainContent.innerHTML = data;
                        
                        // Establecer la fecha actual en el input
                        const fechaFiltro = document.getElementById('fechaFiltro');
                        if (fechaFiltro) {
                            fechaFiltro.value = fechaActual;
                        }
                        
                        asignarEventos();
                    })
                    .catch(error => console.error('Error al cargar la planilla:', error));
            }
        });
    }

    // Evento para cargar clientes.html
    const botonClientes = document.getElementById('btnClientes');
    if (botonClientes) {
        botonClientes.addEventListener('click', function () {
            if (!evitarRecargaSiEnPestañaActual('/dashboard/clientes')) {
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
            }
        });
    }

    // Evento para cargar vehiculos.html
    const botonVehiculos = document.getElementById('btnVehiculos');
    if (botonVehiculos) {
        botonVehiculos.addEventListener('click', function () {
            if (!evitarRecargaSiEnPestañaActual('/dashboard/vehiculos')) {
                console.log("Botón Vehículos clickeado");
                window.history.pushState({}, '', '/dashboard/vehiculos'); // Actualiza la URL sin recargar
                fetch('/dashboard/vehiculos')
                    .then(response => response.text())
                    .then(data => {
                        const mainContent = document.getElementById('bienvenida');
                        mainContent.innerHTML = data; // Reemplaza el contenido con vehiculos.html
                        asignarEventos(); // Reasignar eventos después de cargar la nueva vista
                    })
                    .catch(error => console.error('Error al cargar los vehículos:', error));
            }
        });
    }

    // Evento para cargar personal.html
    const botonPersonal = document.getElementById('btnPersonal');
    if (botonPersonal) {
        botonPersonal.addEventListener('click', function () {
            if (!evitarRecargaSiEnPestañaActual('/dashboard/personal')) {
                console.log("Botón Personal clickeado");
                window.history.pushState({}, '', '/dashboard/personal'); // Actualiza la URL sin recargar
                fetch('/dashboard/personal')
                    .then(response => response.text())
                    .then(data => {
                        const mainContent = document.getElementById('bienvenida');
                        mainContent.innerHTML = data; // Reemplaza el contenido con personal.html
                        asignarEventos(); // Reasignar eventos después de cargar la nueva vista
                    })
                    .catch(error => console.error('Error al cargar el personal:', error));
            }
        });
    }

    // Evento para cargar nuevo_personal.html
    const botonAgregarPersonal = document.getElementById('btnAgregarPersonal');
    if (botonAgregarPersonal) {
        botonAgregarPersonal.addEventListener('click', function () {
            console.log("Botón Agregar Empleado clickeado");
            cargarNuevoPersonal(); // Carga nuevo_personal.html
        });
    }

    const btnFiltrarFecha = document.getElementById('btnFiltrarFecha');
    if (btnFiltrarFecha) {
        btnFiltrarFecha.addEventListener('click', function() {
            console.log('Botón filtrar clickeado');
            const fechaFiltro = document.getElementById('fechaFiltro').value;
            if (fechaFiltro) {
                console.log('Fecha seleccionada:', fechaFiltro);
                filtrarServiciosPorFecha(fechaFiltro);
            }
        });
    }
    // Evento para selección de fila
    const tabla = document.querySelector('table tbody');
    if (tabla) {
        tabla.addEventListener('click', function(e) {
            const fila = e.target.closest('tr');
            if (fila) {
                document.querySelectorAll('tr').forEach(row => row.classList.remove('selected-row'));
                fila.classList.add('selected-row');
            }
        });
    }

    // Evento para agregar lavador
    const btnAgregarLavador = document.getElementById('btnAgregarLavador');
    if (btnAgregarLavador) {
        btnAgregarLavador.addEventListener('click', function() {
            const filaSeleccionada = document.querySelector('.selected-row');
            if (!filaSeleccionada) {
                alert('Por favor seleccione un servicio primero');
                return;
            }
            mostrarModalLavador();
        });
    }

    // Evento para el botón Revisar
    const btnRevisar = document.getElementById('btnRevisar');
    if (btnRevisar) {
        btnRevisar.addEventListener('click', function() {
            const filaSeleccionada = document.querySelector('.selected-row');
            if (!filaSeleccionada) {
                alert('Por favor seleccione un servicio primero');
                return;
            }
            mostrarModalRevisar();
        });
    }
    // Evento para el botón Entregar/Pagar
    const btnEntregar = document.getElementById('btnEntregar');
    if (btnEntregar) {
        btnEntregar.addEventListener('click', function() {
            const filaSeleccionada = document.querySelector('.selected-row');
            if (!filaSeleccionada) {
                alert('Por favor seleccione un servicio primero');
                return;
            }
            mostrarModalPago();
        });
    }
    // Evento para el botón Eliminar
    const btnEliminar = document.getElementById('btnEliminar');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', function() {
            const filaSeleccionada = document.querySelector('.selected-row');
            if (!filaSeleccionada) {
                alert('Por favor seleccione un servicio primero');
                return;
            }
            mostrarModalEliminar();
        });
    }

}

// Función para evitar recargar la pestaña si ya te encuentras en ella
function evitarRecargaSiEnPestañaActual(url) {
    if (window.location.pathname === url) {
        console.log(`Ya estás en ${url}, no se recargará la página.`);
        return true;
    }
    return false;
}

// Evento de carga inicial
document.addEventListener('DOMContentLoaded', function () {
    asignarEventos();
});


// Función para cargar nuevo_servicio.html y configurar eventos
// En dashboard.js
function cargarNuevoServicio() {
    fetch('/dashboard/nuevo_servicio')
        .then(response => response.text())
        .then(data => {
            const mainContent = document.getElementById('bienvenida');
            mainContent.innerHTML = data;
            
            const btnAceptar = document.getElementById('btnAceptar');
            const btnCancelar = document.getElementById('btnCancelar');

            if (btnAceptar) {
                btnAceptar.addEventListener('click', function(event) { 
                    event.preventDefault();

                    const cliente = document.getElementById('cliente').value;
                    const telefono = document.getElementById('telefono').value;
                    const vehiculo = document.getElementById('vehiculo').value;
                    const patente = document.getElementById('patente').value;
                    const servicio = document.getElementById('servicio').value;

                    fetch('/agregar_servicio', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ cliente, telefono, vehiculo, patente, servicio })
                    })
                    .then(response => {
                        if (response.ok) {
                            // Obtener fecha actual y filtrar
                            const hoy = new Date();
                            const fechaActual = hoy.toISOString().split('T')[0];
                            
                            fetch(`/dashboard/filtrar_servicios?fecha=${fechaActual}`)
                                .then(response => response.text())
                                .then(data => {
                                    const mainContent = document.getElementById('bienvenida');
                                    mainContent.innerHTML = data;
                                    
                                    const fechaFiltro = document.getElementById('fechaFiltro');
                                    if (fechaFiltro) {
                                        fechaFiltro.value = fechaActual;
                                    }
                                    
                                    asignarEventos();
                                });
                        }
                    })
                    .catch(error => console.error('Error:', error));
                });
            }

            if (btnCancelar) {
                btnCancelar.addEventListener('click', function() {
                    // Obtener fecha actual y filtrar
                    const hoy = new Date();
                    const fechaActual = hoy.toISOString().split('T')[0];
                    
                    fetch(`/dashboard/filtrar_servicios?fecha=${fechaActual}`)
                        .then(response => response.text())
                        .then(data => {
                            const mainContent = document.getElementById('bienvenida');
                            mainContent.innerHTML = data;
                            
                            const fechaFiltro = document.getElementById('fechaFiltro');
                            if (fechaFiltro) {
                                fechaFiltro.value = fechaActual;
                            }
                            
                            asignarEventos();
                        })
                        .catch(error => console.error('Error:', error));
                });
            }
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('bienvenida'); // Contenedor principal del contenido dinámico

    // Delegación de eventos al cuerpo del documento
    document.body.addEventListener('click', function (event) {
        // Detectar si el botón Agregar Personal fue clickeado
        if (event.target.closest('#btnAgregarPersonal')) {
            console.log("Botón Agregar Empleado clickeado");
            cargarNuevoPersonal(); // Carga nuevo_personal.html
        }
    });
});


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

//Funcion actualizacion tabla empleados
function recargarPersonal() {
    fetch('/dashboard/personal')
        .then(response => response.text())
        .then(data => {
            const mainContent = document.getElementById('bienvenida');
            mainContent.innerHTML = data; // Reemplaza contenido de main con planilla.html

            // Asegúrate de que el DOM esté listo antes de agregar eventos
            agregarEventoNuevoPersonal();
        })
        .catch(error => console.error('Error al recargar planilla:', error));
}

// Función para cargar nuevo_personal.html y configurar eventos
function cargarNuevoPersonal() {
    fetch('/dashboard/nuevo_personal')
        .then(response => response.text())
        .then(data => {
            const mainContent = document.getElementById('bienvenida');
            mainContent.innerHTML = data; // Reemplaza el contenido con nuevo_personal.html
            
            // Configurar eventos para los botones dentro de nuevo_personal.html
            const btnAceptar = document.getElementById('btnAceptar');
            const btnCancelar = document.getElementById('btnCancelar');

            if (btnAceptar) {
                btnAceptar.addEventListener('click', function(event) { 
                    event.preventDefault(); // Evita el envío por defecto del formulario

                    // Recoger los datos del formulario
                    const nombre_empleado = document.getElementById('nombre_empleado').value;
                    const rango = document.getElementById('rango').value;
                    const porcentaje = document.getElementById('porcentaje').value;
                    const telefono = document.getElementById('telefono').value;
                    const direccion = document.getElementById('direccion').value;
                    const nacionalidad = document.getElementById('nacionalidad').value;
                    const fecha_ingreso = document.getElementById('fecha_ingreso').value;

                    // Enviar los datos al servidor con fetch
                    fetch('/agregar_empleado', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ nombre_empleado, rango, porcentaje, telefono, direccion, nacionalidad, fecha_ingreso })
                    })
                    .then(response => {
                        if (response.ok) {
                            // Recargar personal dentro de dashboard
                            fetch('/dashboard/personal')
                                .then(response => response.text())
                                .then(data => {
                                    mainContent.innerHTML = data; // Reemplaza contenido de main con personal.html
                                })
                                .catch(error => console.error('Error al recargar personal:', error));
                        } else {
                            console.error('Error al agregar al personal:', response.statusText);
                        }
                    })
                    .catch(error => console.error('Error en la solicitud:', error));
                });
            }

            if (btnCancelar) {
                btnCancelar.addEventListener('click', function() {
                    // Redirigir a la planilla
                    fetch('/dashboard/personal')
                        .then(response => response.text())
                        .then(data => {
                            mainContent.innerHTML = data; // Reemplaza contenido de main con personal.html
                        })
                        .catch(error => console.error('Error al recargar personal:', error));
                });
            }
        })
        .catch(error => console.error('Error al cargar el formulario de personal:', error));
}

// Evento para el botón Agregar Servicio
function agregarEventoNuevoPersonal() {
    setTimeout(() => { // Retrasa la búsqueda del botón para asegurar que el DOM esté listo
        const botonAgregarCliente = document.getElementById('btnAgregarPersonal');
        if (botonAgregarCliente) {
            console.log("Asociando evento al botón 'Agregar Cliente'.");
            botonAgregarCliente.addEventListener('click', function() {
                console.log("Botón Agregar Cliente clickeado");
                cargarNuevoPersonal(); // Carga nuevo_servicio.html
            });
        } else {
            console.error("El botón 'Agregar Cliente' no se encontró en el DOM.");
        }
    }, 100); // Retraso de 100ms para asegurarte de que el DOM se haya actualizado
}

// Evento para el boton filtro por fecha en planilla

document.addEventListener('DOMContentLoaded', function () {
    asignarEventos();
    const btnFiltrarFecha = document.getElementById('btnFiltrarFecha');
    if (btnFiltrarFecha) {
        btnFiltrarFecha.addEventListener('click', function () {
            const fechaFiltro = document.getElementById('fechaFiltro').value;
            console.log(`Fecha seleccionada: ${fechaFiltro}`); // Agregar este log
            if (fechaFiltro) {
                filtrarServiciosPorFecha(fechaFiltro);
            }
        });
    }
});

// Funcion para filtrar por fecha en planilla
function filtrarServiciosPorFecha(fecha) {
    console.log('Iniciando filtrado para fecha:', fecha);
    fetch(`/dashboard/filtrar_servicios?fecha=${fecha}`)
        .then(response => {
            console.log('Respuesta recibida:', response);
            return response.text();
        })
        .then(data => {
            console.log('Datos recibidos:', data);
            const mainContent = document.getElementById('bienvenida');
            mainContent.innerHTML = data;
            asignarEventos(); // Reasignar eventos después de actualizar el contenido
        })
        .catch(error => {
            console.error('Error al filtrar servicios:', error);
        });
}

// En dashboard.js - Modificar las funciones de manejo del modal
function mostrarModalLavador() {
    const filaSeleccionada = document.querySelector('.selected-row');
    if (!filaSeleccionada) {
        alert('Por favor seleccione un servicio');
        return;
    }

    const servicioId = filaSeleccionada.getAttribute('data-id');
    console.log('ID del servicio seleccionado:', servicioId);

    const modal = document.getElementById('modalLavador');
    modal.style.display = 'block';

    // Cargar lavadores desde la base de datos
    fetch('/obtener_lavadores')
        .then(response => response.json())
        .then(lavadores => {
            const select = document.getElementById('selectLavador');
            select.innerHTML = '<option value="">Seleccione un lavador...</option>';
            lavadores.forEach(lavador => {
                select.innerHTML += `<option value="${lavador.id}">${lavador.nombre}</option>`;
            });
        });

    // Eventos de los botones del modal
    document.getElementById('btnConfirmarLavador').onclick = function() {
        const lavadorId = document.getElementById('selectLavador').value;
        if (!lavadorId) {
            alert('Por favor seleccione un lavador');
            return;
        }

        console.log('Enviando servicioId:', servicioId, 'lavadorId:', lavadorId);
        asignarLavadorAServicio(servicioId, lavadorId);
        modal.style.display = 'none';
    };

    document.getElementById('btnCancelarLavador').onclick = function() {
        modal.style.display = 'none';
    };
}

function asignarLavadorAServicio(servicioId, lavadorId) {
    console.log('Asignando lavador:', lavadorId, 'al servicio:', servicioId);
    
    if (!servicioId) {
        console.error('No se encontró el ID del servicio');
        return;
    }

    fetch('/asignar_lavador', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            servicioId: servicioId, 
            lavadorId: lavadorId 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Recargar tabla con fecha actual
            const fechaFiltro = document.getElementById('fechaFiltro').value;
            fetch(`/dashboard/filtrar_servicios?fecha=${fechaFiltro}`)
                .then(response => response.text())
                .then(data => {
                    const mainContent = document.getElementById('bienvenida');
                    mainContent.innerHTML = data;
                    asignarEventos();
                });
        } else {
            console.error('Error al asignar lavador:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Modificar la función mostrarModalRevisar en dashboard.js
function mostrarModalRevisar() {
    const filaSeleccionada = document.querySelector('.selected-row');
    if (!filaSeleccionada) {
        alert('Por favor seleccione un servicio primero');
        return;
    }

    // Verificar si hay lavador asignado (quinta columna de la tabla)
    const lavadorAsignado = filaSeleccionada.cells[4].textContent.trim();
    if (!lavadorAsignado || lavadorAsignado === "None") {
        alert('Por favor asigne un lavador antes de revisar el servicio');
        return;
    }

    const servicioId = filaSeleccionada.getAttribute('data-id');
    const modal = document.getElementById('modalRevisar');
    modal.style.display = 'block';

    // Resetear checkboxes
    document.getElementById('checkVidrios').checked = false;
    document.getElementById('checkAspirado').checked = false;
    document.getElementById('checkEncerado').checked = false;

    // Eventos de los botones del modal
    document.getElementById('btnConfirmarRevision').onclick = function() {
        const vidrios = document.getElementById('checkVidrios').checked;
        const aspirado = document.getElementById('checkAspirado').checked;
        const encerado = document.getElementById('checkEncerado').checked;

        if (!vidrios || !aspirado || !encerado) {
            alert('Por favor complete todas las tareas');
            return;
        }

        actualizarEstadoServicio(servicioId);
        modal.style.display = 'none';
    };

    document.getElementById('btnCancelarRevision').onclick = function() {
        modal.style.display = 'none';
    };
}

function actualizarEstadoServicio(servicioId) {
    fetch('/actualizar_estado_servicio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            servicioId: servicioId,
            estado: 'Revisado'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Recargar tabla con fecha actual
            const fechaFiltro = document.getElementById('fechaFiltro').value;
            fetch(`/dashboard/filtrar_servicios?fecha=${fechaFiltro}`)
                .then(response => response.text())
                .then(data => {
                    const mainContent = document.getElementById('bienvenida');
                    mainContent.innerHTML = data;
                    asignarEventos();
                });
        } else {
            console.error('Error al actualizar estado:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function mostrarModalPago() {
    const filaSeleccionada = document.querySelector('.selected-row');
    if (!filaSeleccionada) {
        alert('Por favor seleccione un servicio primero');
        return;
    }

    // Verificar lavador asignado
    const lavadorAsignado = filaSeleccionada.cells[4].textContent.trim();
    if (!lavadorAsignado || lavadorAsignado === "None") {
        alert('Este servicio no tiene lavador asignado');
        return;
    }

    // Verificar estado revisado
    const estadoServicio = filaSeleccionada.cells[6].textContent.trim();
    if (estadoServicio !== "Revisado") {
        alert('El servicio debe estar revisado antes de proceder al pago');
        return;
    }

    // Obtener datos del servicio
    const servicioId = filaSeleccionada.getAttribute('data-id');
    const cliente = filaSeleccionada.cells[0].textContent;
    const patente = filaSeleccionada.cells[1].textContent;
    const servicio = filaSeleccionada.cells[3].textContent;
    const lavador = filaSeleccionada.cells[4].textContent;
    const valor = filaSeleccionada.cells[5].textContent;

    // Llenar detalles en el modal
    document.getElementById('detalleCliente').textContent = cliente;
    document.getElementById('detalleVehiculo').textContent = servicio;
    document.getElementById('detallePatente').textContent = patente;
    document.getElementById('detalleLavador').textContent = lavador;
    document.getElementById('detalleServicio').textContent = servicio;
    document.getElementById('detalleValor').textContent = valor.replace('$', '');

    const modal = document.getElementById('modalPago');
    modal.style.display = 'block';

    // Eventos de los botones del modal
    document.getElementById('btnConfirmarPago').onclick = function() {
        const formaPago = document.getElementById('selectFormaPago').value;
        if (!formaPago) {
            alert('Por favor seleccione una forma de pago');
            return;
        }

        procesarPago(servicioId, formaPago);
        modal.style.display = 'none';
    };

    document.getElementById('btnCancelarPago').onclick = function() {
        modal.style.display = 'none';
    };
}

function procesarPago(servicioId, formaPago) {
    fetch('/procesar_pago', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            servicioId: servicioId,
            formaPago: formaPago
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const fechaFiltro = document.getElementById('fechaFiltro').value;
            fetch(`/dashboard/filtrar_servicios?fecha=${fechaFiltro}`)
                .then(response => response.text())
                .then(data => {
                    const mainContent = document.getElementById('bienvenida');
                    mainContent.innerHTML = data;
                    asignarEventos();
                });
        } else {
            console.error('Error al procesar pago:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function mostrarModalEliminar() {
    const filaSeleccionada = document.querySelector('.selected-row');
    const servicioId = filaSeleccionada.getAttribute('data-id');
    
    const modal = document.getElementById('modalEliminar');
    modal.style.display = 'block';

    document.getElementById('btnConfirmarEliminar').onclick = function() {
        const password = document.getElementById('passwordEliminar').value;
        if (!password) {
            alert('Por favor ingrese la contraseña');
            return;
        }

        eliminarServicio(servicioId, password);
        modal.style.display = 'none';
    };

    document.getElementById('btnCancelarEliminar').onclick = function() {
        modal.style.display = 'none';
    };
}

function eliminarServicio(servicioId, password) {
    fetch('/eliminar_servicio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            servicioId: servicioId,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const fechaFiltro = document.getElementById('fechaFiltro').value;
            fetch(`/dashboard/filtrar_servicios?fecha=${fechaFiltro}`)
                .then(response => response.text())
                .then(data => {
                    const mainContent = document.getElementById('bienvenida');
                    mainContent.innerHTML = data;
                    asignarEventos();
                });
        } else {
            alert(data.error || 'Contraseña incorrecta');
        }
    })
    .catch(error => console.error('Error:', error));
}