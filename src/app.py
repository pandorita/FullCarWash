from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from datetime import timedelta
import sqlite3
import os

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
    client_id INTEGER REFERENCES clients(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    service_id INTEGER REFERENCES services(id),
    worker_id INTEGER REFERENCES workers(id),
    discount_id INTEGER REFERENCES discounts(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    phone TEXT,
    email TEXT
);

CREATE TABLE IF NOT EXISTS vehiculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER REFERENCES clients(id),
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    license_plate TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    valor REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS workers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position TEXT,
    phone TEXT
);

CREATE TABLE IF NOT EXISTS discounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    percentage REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL
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
    cursor.execute("SELECT * FROM planilla")  # Consulta todos los servicios
    servicios = cursor.fetchall()  # Recupera todos los servicios
    conn.close()
    
    # Verifica el contenido de los servicios
    print("Servicios recuperados:", servicios)  # Asegúrate de que esta línea imprima algo

     # Renderiza planilla.html
    return render_template('planilla.html', servicios=servicios)


# Ruta para mostrar el formulario
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
    nombre = data.get('nombre')
    precio = data.get('precio')
    
    # Insertar los datos en la base de datos
    if nombre and precio:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO servicios (nombre, precio) VALUES (?, ?)", (nombre, precio))
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


if __name__ == "__main__":
    # Crear base de datos al iniciar la aplicación
    create_database()
    print("¡Todo listo para empezar!")
    app.config.from_object(config['development'])
    app.run()
