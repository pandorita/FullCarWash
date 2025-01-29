from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from datetime import timedelta
import sqlite3
import os
from datetime import datetime

from config import config

app = Flask(__name__)
app.secret_key = 'clave_secreta_para_sesiones'
app.permanent_session_lifetime = timedelta(minutes=30)
# Ruta a la base de datos
DATABASE_PATH = "db/lavado.db"

# Esquema de la base de datos
SCHEMA = """

CREATE TABLE IF NOT EXISTS planilla (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente TEXT NOT NULL,
    telefono TEXT NOT NULL,
    vehiculo TEXT NOT NULL,
    patente TEXT NOT NULL,
    lavador TEXT NOT NULL,
    servicio TEXT NOT NULL,
    fecha TEXT NOT NULL,
    hora_ing TIME NOT NULL,       
    hora_sal TIME,                 
    valor_total REAL NOT NULL,
    estado TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    telefono TEXT,
    correo TEXT
);

CREATE TABLE IF NOT EXISTS vehiculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER REFERENCES clientes(id),
    model TEXT NOT NULL,
    color TEXT NOT NULL,
    patente TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS servicios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tamaño TEXT NOT NULL,
    valor REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS empleados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    rango TEXT NOT NULL,
    porcentaje REAL NOT NULL,
    telefono TEXT NOT NULL,
    direccion TEXT NOT NULL,
    nacionalidad TEXT NOT NULL,
    fecha_ingreso DATE NOT NULL,
    fecha_salida DATE
);


CREATE TABLE IF NOT EXISTS descuentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    porcentaje REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL UNIQUE,
    contraseña TEXT NOT NULL,
    nivel TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dailynotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_date DATE NOT NULL,
    content TEXT
);

CREATE TABLE IF NOT EXISTS workernotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_id INTEGER REFERENCES workers(id),
    note_date DATE NOT NULL,
    content TEXT
);

CREATE TABLE IF NOT EXISTS dailychecklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_id INTEGER REFERENCES workers(id),
    check_date DATE NOT NULL,
    present BOOLEAN NOT NULL
);


"""

# Página principal ayuda
@app.route('/')
def home():
    return render_template('index.html')


# Página de inicio de sesión
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        # Aquí podrías validar el usuario y la contraseña
        if username == 'admin' and password == 'admin123':
            session.permanent = True  # Marca la sesión como permanente
            session['user'] = username  # Guarda el usuario en la sesión
            return redirect(url_for('dashboard'))
        else:
            return "Usuario o contraseña incorrectos"
    return render_template('login.html')

# Página interna (dashboard)
@app.route('/dashboard')
def dashboard():
    if 'user' not in session:  # Verifica si el usuario está autenticado
        return redirect(url_for('login'))
    return render_template('dashboard.html')

@app.route('/logout')
def logout():
    session.pop('user', None)  # Elimina al usuario de la sesión
    return redirect(url_for('home'))

@app.route('/dashboard/planilla')
def dashboard_planilla():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    # Carga los servicios desde la base de datos
    conn = sqlite3.connect('db/lavado.db')  # Conéctate a la base de datos
    cursor = conn.cursor()
    cursor.execute("""
                    SELECT * FROM planilla
                   """)  
    servicios = cursor.fetchall()  # Recupera todos los servicios
    conn.close()
    
    # Verifica el contenido de los servicios
    print("Servicios recuperados:", servicios)  # Asegúrate de que esta línea imprima algo

     # Renderiza planilla.html
    return render_template('planilla.html', servicios=servicios)


# Ruta para mostrar el formulario para nuevo servicio
@app.route('/dashboard/nuevo_servicio')
def nuevo_servicio():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('nuevo_servicio.html')

# Ruta para manejar el envío del formulario y agregar los datos a la base de datos
@app.route('/agregar_servicio', methods=['POST'])
def agregar_servicio():
    # Obtener los datos del formulario
    data = request.get_json()
    cliente = data.get('cliente')
    telefono = data.get('telefono')
    vehiculo = data.get('vehiculo')
    patente = data.get('patente')
    servicio = data.get('servicio')
    valor = 10000 #Eliminar linea y agregar sistema automatico desde tipo de servicio
    estado = 'Recibido'

    # Obtener la fecha y hora actuales
    fecha_actual = datetime.now().strftime('%Y-%m-%d')
    hora_actual = datetime.now().strftime('%H:%M')
    
    # Insertar los datos en la base de datos
    if (cliente and servicio and telefono and patente):
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("""INSERT INTO planilla (cliente, telefono, vehiculo, patente, servicio, fecha, hora_ing, valor_total, estado) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
                       (cliente, telefono, vehiculo, patente, servicio, fecha_actual, hora_actual, valor, estado))
        conn.commit()
        conn.close()
    
    # Redirigir a la página de planilla o refrescar los datos
        return jsonify({"success": True, "message": "Servicio agregado con éxito"})
    else:
        return jsonify({"success": False, "message": "Datos inválidos"}), 400

def create_database():
    """Crea la base de datos y las tablas si no existen."""
    # Asegúrate de que el directorio `db/` exista
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
    
    # Conectar a la base de datos
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Ejecutar el esquema
    cursor.executescript(SCHEMA)
    print(f"Base de datos creada o verificada en: {DATABASE_PATH}")
    
    # Cerrar conexión
    conn.close()

@app.route('/dashboard/clientes')
def dashboard_clientes():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    # Carga los servicios desde la base de datos
    conn = sqlite3.connect('db/lavado.db')  # Conéctate a la base de datos
    cursor = conn.cursor()
    cursor.execute("""
                    SELECT * FROM clientes
                   """)  
    servicios = cursor.fetchall()  # Recupera todos los clientes
    conn.close()
    
    # Verifica el contenido de los servicios
    print("Clientes recuperados:", servicios)  # Asegúrate de que esta línea imprima algo

     # Renderiza planilla.html
    return render_template('clientes.html', servicios=servicios)

@app.route('/dashboard/vehiculos')
def dashboard_vehiculos():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    # Carga los vehículos desde la base de datos
    conn = sqlite3.connect(DATABASE_PATH)  # Conéctate a la base de datos
    cursor = conn.cursor()
    cursor.execute("""
                    SELECT * FROM vehiculos
                   """)  
    vehiculos = cursor.fetchall()  # Recupera todos los vehículos
    conn.close()
    
    # Verifica el contenido de los vehículos
    print("Vehículos recuperados:", vehiculos)  # Asegúrate de que esta línea imprima algo

    # Renderiza vehiculos.html
    return render_template('vehiculos.html', vehiculos=vehiculos)

@app.route('/dashboard/personal')
def dashboard_personal():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    # Carga el personal desde la base de datos
    conn = sqlite3.connect(DATABASE_PATH)  # Conéctate a la base de datos
    cursor = conn.cursor()
    cursor.execute("""
                    SELECT * FROM empleados
                   """)  
    personal = cursor.fetchall()  # Recupera todo el personal
    conn.close()

    # Verifica el contenido del personal
    print("Personal recuperado:", personal)  # Asegúrate de que esta línea imprima algo
    
    # Renderiza personal.html
    return render_template('personal.html', personal=personal)

# Ruta para mostrar el formulario para nuevo personal
@app.route('/dashboard/nuevo_personal')
def nuevo_personal():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('/personal/nuevo_personal.html')


# Ruta para manejar el envío del formulario y agregar los datos a la base de datos
@app.route('/agregar_empleado', methods=['POST'])
def agregar_empleado():
    # Obtener los datos del formulario
    data = request.get_json()
    nombre_empleado = data.get('nombre_empleado')
    rango = data.get('rango')
    porcentaje = data.get('porcentaje')
    telefono = data.get('telefono')
    direccion = data.get('direccion')
    nacionalidad = data.get('nacionalidad')
    fecha_ingreso = data.get('fecha_ingreso')

    # Obtener la fecha y hora actuales
    fecha_actual = datetime.now().strftime('%d/%m/%Y')
    hora_actual = datetime.now().strftime('%H:%M')
    
    # Insertar los datos en la base de datos
    if (nombre_empleado and rango and telefono and porcentaje):
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("""INSERT INTO empleados (nombre, rango, porcentaje, telefono, direccion, nacionalidad, fecha_ingreso) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)""", 
                       (nombre_empleado, rango, porcentaje, telefono, direccion, nacionalidad, fecha_ingreso))
        conn.commit()
        conn.close()
    
    # Redirigir a la página de planilla o refrescar los datos
        return jsonify({"success": True, "message": "Empleado agregado con éxito"})
    else:
        return jsonify({"success": False, "message": "Datos inválidos"}), 400

# Ruta para filtrar servicios por fecha
@app.route('/dashboard/filtrar_servicios')
def filtrar_servicios():
    fecha = request.args.get('fecha')
    print(f"Fecha recibida para filtrar: {fecha}")
    
    if fecha:
        try:
            conn = sqlite3.connect(DATABASE_PATH)
            cursor = conn.cursor()
            
            # Consultar los servicios filtrados por fecha
            cursor.execute("SELECT * FROM planilla WHERE fecha = ? AND estado != 'Eliminado'", (fecha,))
            servicios = cursor.fetchall()
            print(f"Servicios encontrados: {len(servicios)}")
            
            conn.close()
            
            return render_template('planilla.html', servicios=servicios)
        except Exception as e:
            print(f"Error al filtrar servicios: {str(e)}")
            return redirect(url_for('dashboard_planilla'))
    
    return redirect(url_for('dashboard_planilla'))

# Agregar a app.py
@app.route('/obtener_lavadores')
def obtener_lavadores():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre FROM empleados WHERE rango = 'lavador'")
    lavadores = cursor.fetchall()
    conn.close()
    
    return jsonify([{'id': id, 'nombre': nombre} for id, nombre in lavadores])

# En app.py - Modificar la función asignar_lavador
@app.route('/asignar_lavador', methods=['POST'])
def asignar_lavador():
    data = request.get_json()
    servicio_id = data.get('servicioId')
    lavador_id = data.get('lavadorId')
    
    print(f"Asignando lavador ID {lavador_id} al servicio ID {servicio_id}")
    
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Primero obtener el nombre del lavador
        cursor.execute("SELECT nombre FROM empleados WHERE id = ?", (lavador_id,))
        lavador_nombre = cursor.fetchone()[0]
        
        # Actualizar el servicio con el nombre del lavador
        cursor.execute("UPDATE planilla SET lavador = ? WHERE id = ?", 
                      (lavador_nombre, servicio_id))
        
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error al asignar lavador: {str(e)}")
        return jsonify({"success": False, "error": str(e)})

# Agregar a app.py
@app.route('/actualizar_estado_servicio', methods=['POST'])
def actualizar_estado_servicio():
    data = request.get_json()
    servicio_id = data.get('servicioId')
    estado = data.get('estado')
    
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        cursor.execute("UPDATE planilla SET estado = ? WHERE id = ?", 
                      (estado, servicio_id))
        
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error al actualizar estado: {str(e)}")
        return jsonify({"success": False, "error": str(e)})

# Agregar a app.py
@app.route('/procesar_pago', methods=['POST'])
def procesar_pago():
    data = request.get_json()
    servicio_id = data.get('servicioId')
    forma_pago = data.get('formaPago')
    
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Actualizar estado del servicio a Pagado
        cursor.execute("UPDATE planilla SET estado = 'Pagado' WHERE id = ?", 
                      (servicio_id,))
        
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error al procesar pago: {str(e)}")
        return jsonify({"success": False, "error": str(e)})
    
# Agregar a app.py
@app.route('/eliminar_servicio', methods=['POST'])
def eliminar_servicio():
    data = request.get_json()
    servicio_id = data.get('servicioId')
    password = data.get('password')
    
    # Contraseña hardcodeada para ejemplo - debería estar en config
    if password != "admin123":
        return jsonify({"success": False, "error": "Contraseña incorrecta"})
    
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Actualizar estado del servicio a Eliminado
        cursor.execute("UPDATE planilla SET estado = 'Eliminado' WHERE id = ?", 
                      (servicio_id,))
        
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error al eliminar servicio: {str(e)}")
        return jsonify({"success": False, "error": str(e)})


if __name__ == "__main__":
    # Crear base de datos al iniciar la aplicación
    create_database()
    print("¡Todo listo para empezar!")
    app.config.from_object(config['development'])
    app.run()
