# ☁️ Guía de Despliegue Gratuito en Render.com

Vamos a subir tu backend a **Render**, que ofrece un plan gratuito ideal para pruebas.

## 📂 Paso 1: Preparar los Archivos

He creado una carpeta llamada `deployment` en tu proyecto `FaringoApp`.
Necesito que **COPIES** tus archivos del backend (`app.py` y `processor.py`) dentro de esa carpeta `deployment`.

La estructura debe quedar así:
```
FaringoApp/
├── deployment/
│   ├── Dockerfile          (Ya creado)
│   ├── requirements.txt    (Ya creado)
│   ├── app.py             <-- COPIA ESTE ARCHIVO AQUÍ
│   └── processor.py       <-- COPIA ESTE ARCHIVO AQUÍ
```

---

## 🐙 Paso 2: Subir a GitHub

Desde tu terminal en `FaringoApp`:

```bash
git add .
git commit -m "Preparar deployment para Render"
git push
```

---

## 🚀 Paso 3: Crear Servicio en Render

1.  Ve a [dashboard.render.com](https://dashboard.render.com/) y crea una cuenta (puedes usar GitHub).
2.  Haz clic en **"New +"** y selecciona **"Web Service"**.
3.  Conecta tu repositorio de GitHub (`FaringoApp`).
4.  Configura lo siguiente:
    *   **Name:** `faringo-backend` (o lo que quieras)
    *   **Region:** Oregon (US West) o la más cercana.
    *   **Root Directory:** `deployment`  <-- **MUY IMPORTANTE**
    *   **Runtime:** Docker
    *   **Instance Type:** Free
5.  Haz clic en **"Create Web Service"**.

---

## ⏳ Paso 4: Esperar y Obtener URL

Render empezará a construir tu app. Puede tardar unos 5-10 minutos la primera vez.
Cuando termine, verás un check verde ✅ y una URL arriba a la izquierda, tipo:
`https://faringo-backend.onrender.com`

**Esa es tu nueva URL del servidor.**

---

## 📱 Paso 5: Conectar la App Móvil

1.  Abre tu App Móvil.
2.  En la pantalla de configuración, en lugar de poner la IP de tu casa (`192.168...`), pon la URL de Render:
    `https://faringo-backend.onrender.com`
3.  ¡Listo! Ahora tu app funcionará en cualquier lugar del mundo.

---

### ⚠️ Nota sobre el Plan Gratuito
*   **Velocidad:** El servidor se "duerme" si nadie lo usa por 15 minutos. La primera petición después de dormir puede tardar 30-60 segundos en responder.
*   **Archivos:** Los videos subidos se borran cada vez que el servidor se reinicia (es normal en la nube). Para producción real usaremos almacenamiento externo (S3/Cloudinary), pero para probar funciona perfecto.
