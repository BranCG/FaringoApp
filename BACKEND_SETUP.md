# ¡IMPORTANTE! Configuración del Backend

Para que la app móvil funcione, debes agregar CORS al backend de FaringoTracker.

## Paso 1: Instalar flask-cors

Abre una terminal en la carpeta del backend y ejecuta:

```bash
cd FaringoTracker/backend
pip install flask-cors
```

## Paso 2: Modificar app.py

Abre el archivo `FaringoTracker/backend/app.py` y agrega estas líneas:

### Al inicio del archivo (con los otros imports):
```python
from flask_cors import CORS
```

### Después de crear la app Flask (donde dice `app = Flask(__name__)`):
```python
app = Flask(__name__)
CORS(app)  # <-- AGREGAR ESTA LÍNEA
```

### Agregar endpoint de health check (antes de `if __name__ == '__main__':`):
```python
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200
```

## Ejemplo completo del inicio de app.py:

```python
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS  # <-- NUEVO
import os
from werkzeug.utils import secure_filename
from processor import process_video
import uuid

app = Flask(__name__)
CORS(app)  # <-- NUEVO

UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv'}

# ... resto del código ...

@app.route('/health', methods=['GET'])  # <-- NUEVO
def health_check():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

## Paso 3: Reiniciar el backend

Detén el servidor Flask (Ctrl+C) y vuelve a iniciarlo:

```bash
python app.py
```

¡Listo! Ahora la app móvil podrá conectarse al backend.
