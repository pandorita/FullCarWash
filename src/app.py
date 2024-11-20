from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import sqlite3

from config import config

app = Flask(__name__)
app.secret_key = 'clave_secreta_para_sesiones'

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
    cursor.execute("SELECT * FROM servicios")  # Consulta todos los servicios
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
        conn = sqlite3.connect('db/lavado.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO servicios (nombre, precio) VALUES (?, ?)", (nombre, precio))
        conn.commit()
        conn.close()
    
    # Redirigir a la página de planilla o refrescar los datos
        return jsonify({"success": True, "message": "Servicio agregado con éxito"})
    else:
        return jsonify({"success": False, "message": "Datos inválidos"}), 400


if __name__ == "__main__":
    app.config.from_object(config['development'])
    app.run()
