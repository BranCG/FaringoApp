# FaringoApp - Mobile App

Aplicación móvil para tracking de movimientos laríngeos y medición de constricción faríngea.

## 📱 Características

- **Modo Rombo (💎)**: Medición de área y constricción faríngea
- **Modo Contornos (📏)**: Tracking de estructuras laríngeas deformables
- **Interfaz táctil**: Dibuja puntos directamente en el video
- **Multiplataforma**: Funciona en Android y iOS vía Expo Go
- **Conectividad WiFi**: Se conecta al servidor backend en tu PC

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
cd FaringoApp
npm install
```

2. **Configurar el backend (en tu PC):**

Necesitas agregar CORS al archivo `backend/app.py` de FaringoTracker:

```python
# Agregar al inicio del archivo
from flask_cors import CORS

# Después de crear la app Flask
app = Flask(__name__)
CORS(app)  # <-- Agregar esta línea

# Agregar endpoint de health check
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200
```

3. **Instalar flask-cors en el backend:**
```bash
cd ../FaringoTracker/backend
pip install flask-cors
```

## ▶️ Ejecutar la App

1. **Iniciar el backend (en tu PC):**
```bash
cd FaringoTracker/backend
python app.py
```

2. **Iniciar Expo (en FaringoApp):**
```bash
cd FaringoApp
npx expo start
```

3. **Abrir en tu celular:**
   - Instala **Expo Go** desde Play Store (Android) o App Store (iOS)
   - Escanea el código QR que aparece en la terminal
   - La app se abrirá automáticamente

## 📝 Uso

1. **Configuración inicial:**
   - Al abrir la app, ingresa la IP de tu PC (ej: `192.168.1.100`)
   - Verifica que tu celular y tu PC estén en la misma red WiFi
   - Presiona "Conectar al Servidor"

2. **Procesar video:**
   - Selecciona el modo (Rombo o Contornos)
   - Elige un video de tu galería
   - Dibuja los puntos tocando la pantalla
   - Presiona "Procesar"
   - Espera a que el backend procese el video
   - Visualiza el resultado con las métricas

## 🔧 Solución de Problemas

### No se conecta al servidor
- Verifica que el backend esté corriendo (`python app.py`)
- Asegúrate de estar en la misma red WiFi
- Prueba la IP ejecutando `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
- Verifica que el firewall permita conexiones en el puerto 5000

### Error al subir video
- Verifica que agregaste CORS al backend
- Revisa que el video no sea muy grande (< 100MB recomendado)
- Asegúrate de tener permisos de acceso a la galería

### La app no inicia
- Ejecuta `npm install` nuevamente
- Limpia caché: `npx expo start --clear`
- Reinstala Expo Go en el teléfono

## 📦 Structure

```
FaringoApp/
├── App.js              # Navegación principal
├── app.json            # Configuración de Expo
├── screens/
│   ├── ConfigScreen.js       # Configuración del servidor
│   ├── ModeSelector.js       # Selección de modo
│   ├── VideoUploadScreen.js  # Subir y dibujar
│   ├── ProcessingScreen.js   # Estado de procesamiento
│   └── ResultsScreen.js      # Resultados
└── services/
    └── api.js          # Servicios de API
```

## 🛠️ Tecnologías

- React Native + Expo
- Expo Image Picker (selección de video)
- Expo AV (reproducción de video)
- React Navigation (navegación)
- Axios (peticiones HTTP)
- React Native SVG (dibujo de puntos/líneas)
- AsyncStorage (almacenamiento local)

## 📄 Licencia

MIT
