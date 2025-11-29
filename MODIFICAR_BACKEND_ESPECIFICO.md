# 🔧 Modificaciones Específicas para tu Backend

## Archivos a Modificar
1. `processor.py` - Para calcular y retornar estadísticas
2. `app.py` - Para recibir y devolver las estadísticas

---

## PASO 1: Modificar `processor.py`

Abre `APP WEBS IDEAS\FaringoTracker\backend\processor.py`

### 1.1 Agregar función de cálculo de estadísticas

Al inicio del archivo (después de los imports), agrega:

```python
import numpy as np

def calculate_statistics(areas_list):
    """Calcula estadísticas de las áreas capturadas"""
    if not areas_list or len(areas_list) == 0:
        return None
    
    areas = np.array(areas_list)
    
    min_area = float(np.min(areas))
    max_area = float(np.max(areas))
    avg_area = float(np.mean(areas))
    
    # Porcentaje de constricción
    constriction_percentage = ((max_area - min_area) / max_area * 100) if max_area > 0 else 0
    
    # Varianza para medir estabilidad
    area_variance = float(np.var(areas))
    
    return {
        'min_area': min_area,
        'max_area': max_area,
        'avg_area': avg_area,
        'constriction_percentage': constriction_percentage,
        'area_variance': area_variance,
        'total_frames': len(areas)
    }
```

### 1.2 Modificar la función `process_video`

Busca la función `process_video` y modifícala para que:

**ANTES:**
```python
def process_video(input_path, output_path, lines):
    # ... código de procesamiento ...
    
    # Al final solo guardas el video
    out.release()
    cap.release()
```

**DESPUÉS:**
```python
def process_video(input_path, output_path, lines):
    areas_list = []  # ← AGREGAR ESTA LISTA AL INICIO
    
    # ... código de procesamiento ...
    
    # Dentro del loop de frames, cuando calculas el área:
    # (busca donde está cv2.contourArea o similar)
    area = cv2.contourArea(contorno)  # o como lo calcules
    areas_list.append(area)  # ← AGREGAR ESTO
    
    # ... resto del código ...
    
    # Al final, antes de release:
    out.release()
    cap.release()
    
    # Calcular estadísticas
    statistics = calculate_statistics(areas_list)
    
    # RETORNAR ESTADÍSTICAS
    return statistics  # ← CAMBIAR AQUÍ
```

**⚠️ IMPORTANTE:** Busca en tu código donde calculas el área del rombo/contorno. Probablemente está en un loop `while cap.isOpened()` o similar.

---

## PASO 2: Modificar `app.py`

Reemplaza la función `upload_video` completa con esta versión:

```python
@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filename = str(uuid.uuid4()) + "_" + file.filename
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(input_path)
    
    # Get lines from request
    import json
    lines = []
    if 'lines' in request.form:
        try:
            lines = json.loads(request.form['lines'])
        except:
            print("Error parsing lines")
    
    # Process the video
    output_filename = "processed_" + filename
    output_path = os.path.join(PROCESSED_FOLDER, output_filename)
    
    try:
        # CAMBIO AQUÍ: Capturar las estadísticas que devuelve process_video
        statistics = process_video(input_path, output_path, lines)
        
        return jsonify({
            'message': 'Video processed successfully',
            'original_url': f'/uploads/{filename}',
            'processed_url': f'/processed/{output_filename}',
            'statistics': statistics  # ← AGREGAR ESTO
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

---

## PASO 3: Instalar numpy (si no está instalado)

En la terminal del backend:

```bash
pip install numpy
```

---

## PASO 4: Ejemplo de dónde agregar `areas_list.append(area)`

Busca en `processor.py` algo similar a esto:

```python
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    # ... tracking del rombo ...
    
    # Busca donde calculas el área, por ejemplo:
    pts = np.array([punto1, punto2, punto3, punto4])
    area = cv2.contourArea(pts)
    
    # ← AGREGAR AQUÍ:
    areas_list.append(area)
    
    # ... dibujar en el frame ...
    
    out.write(frame)
```

---

## PASO 5: Reiniciar el Backend

1. Detén el servidor (Ctrl+C)
2. Reinicia:
   ```bash
   cd "APP WEBS IDEAS\FaringoTracker\backend"
   python app.py
   ```

---

## Verificar que Funciona

Después de reiniciar:

1. **Recarga la app móvil** (sacude → Reload)
2. **Procesa un video**
3. **Deberías ver** las estadísticas y el análisis automático

---

## ¿Necesitas Ayuda?

Si no encuentras dónde está el cálculo del área en `processor.py`, copia aquí la parte relevante del código (el loop donde procesas frames) y te ayudo a ubicarlo exactamente.
