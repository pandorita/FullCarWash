from flask import Flask, render_template, request, redirect, url_for, session

from config import config

app = Flask(__name__)
app.secret_key = 'clave_secreta_para_sesiones'

# Página principal
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



if __name__ == "__main__":
    app.config.from_object(config['development'])
    app.run()
