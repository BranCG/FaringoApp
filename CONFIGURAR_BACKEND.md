# Configuración del Backend - Paso a Paso

## 📍 Tu IP: 192.168.100.3

## Paso 1: Instalar flask-cors

Abre una terminal (PowerShell o CMD) y ejecuta:

```bash
pip install flask-cors
```

**Espera a que termine de instalar.**

---

## Paso 2: Modificar app.py del Backend

### 2.1. Ubicar el archivo

Busca y abre el archivo:
```
FaringoTracker/backend/app.py
```

(Si FaringoTracker está en otro lugar, busca ese archivo)

### 2.2. Agregar el import de CORS

Al **inicio del archivo** (donde están los otros imports), agrega esta línea:

```python
from flask_cors import CORS
```

**Ejemplo de cómo debería verse:**
```python
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS  # <-- AGREGAR ESTA LÍNEA
import os
from werkzeug.utils import secure_filename
from processor import process_video
import uuid
```

### 2.3. Habilitar CORS en la app

Justo **después** de la línea `app = Flask(__name__)`, agrega:

```python
CORS(app)
```

**Ejemplo de cómo debería verse:**
```python
app = Flask(__name__)
CORS(app)  # <-- AGREGAR ESTA LÍNEA

UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'
```

### 2.4. Agregar endpoint de health check

Busca la línea `if __name__ == '__main__':` y **ANTES** de esa línea, agrega este endpoint:

```python
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200
```

**Ejemplo completo:**
```python
@app.route('/result/<filename>')
def get_result(filename):
    return send_from_directory(RESULT_FOLDER, filename)

@app.route('/health', methods=['GET'])  # <-- AGREGAR ESTE BLOQUE
def health_check():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

---

## Paso 3: Reiniciar el Backend

1. Si el servidor Flask está corriendo, **detenlo** (Ctrl+C en la terminal)

2. **Vuelve a iniciarlo:**
```bash
cd FaringoTracker/backend
python app.py
```

3. Deberías ver algo como:
```
 * Running on http://0.0.0.0:5000
 * Running on http://192.168.100.3:5000
```

---

## Paso 4: Probar desde la App

1. En tu iPhone, **recarga la app** (sacude → "Reload")

2. Toca botón de navegación para volver

3. Ve a **"Configuración"** (o desde el menú inicial)

4. Ingresa la IP: **192.168.100.3**

5. Presiona **"Conectar al Servidor"**

6. Deberías ver mensaje de **"Conexión exitosa"** ✅

---

## Problemas Comunes

### Error: "Module 'flask_cors' not found"
**Solución:** Ejecuta de nuevo `pip install flask-cors`

### Error: "No se pudo conectar"
**Solución:** 
- Verifica que el backend esté corriendo
- Verifica que tu iPhone y PC estén en la misma red WiFi
- Verifica que el firewall de Windows permita el puerto 5000

### Para verificar que el backend está corriendo:
Abre el navegador en tu PC y ve a:
```
http://localhost:5000/health
```

Deberías ver: `{"status":"ok"}`

---

¿En qué paso estás ahora? ¿Ya instalaste flask-cors?
