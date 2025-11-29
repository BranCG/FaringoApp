# 📊 Guía: Agregar Estadísticas al Backend de FaringoTracker

## Objetivo
Modificar el backend para que calcule y devuelva estadísticas de contracción cuando procesa un video.

## Archivo a Modificar
`APP WEBS IDEAS\FaringoTracker\backend\app.py`

---

## Paso 1: Agregar Función para Calcular Estadísticas

Agrega esta función en `app.py` (antes de la ruta `/upload`):

```python
def calculate_statistics(areas_list):
    """
    Calcula estadísticas de las áreas capturadas durante el tracking
    
    Args:
        areas_list: Lista de áreas medidas en cada frame
        
    Returns:
        dict con estadísticas calculadas
    """
    if not areas_list or len(areas_list) == 0:
        return None
    
    import numpy as np
    
    areas = np.array(areas_list)
    
    min_area = float(np.min(areas))
    max_area = float(np.max(areas))
    avg_area = float(np.mean(areas))
    
    # Calcular porcentaje de constricción
    # (área máxima - área mínima) / área máxima * 100
    constriction_percentage = ((max_area - min_area) / max_area * 100) if max_area > 0 else 0
    
    # Calcular varianza para medir estabilidad
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

---

## Paso 2: Modificar el Código de Procesamiento

Busca la parte del código donde procesas el video y calculas las áreas. Debes **guardar todas las áreas** en una lista.

### Ejemplo (aproximado):

```python
# Mientras procesas cada frame
areas_list = []  # ← AGREGAR ESTA LISTA

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    # ... tu código de tracking ...
    
    # Cuando calculas el área del rombo/contorno
    area = cv2.contourArea(contour)  # o como calcules el área
    
    areas_list.append(area)  # ← GUARDAR EL ÁREA
    
    # ... resto del código ...

cap.release()
```

---

## Paso 3: Calcular y Devolver Estadísticas

Al final del procesamiento, **antes del `return`**, calcula las estadísticas:

```python
# Después de procesar todo el video y antes de hacer return

# Calcular estadísticas
statistics = calculate_statistics(areas_list)

# Modificar el return para incluir las estadísticas
return jsonify({
    'message': 'Video processed successfully',
    'original_url': f'/uploads/{filename}',
    'processed_url': f'/processed/{processed_filename}',
    'statistics': statistics  # ← AGREGAR ESTO
}), 200
```

---

## Paso 4: Verificar que numpy está instalado

El código usa numpy para los cálculos. Verifica que esté instalado:

```bash
pip install numpy
```

---

## Ejemplo Completo de Respuesta Esperada

Después de estos cambios, el backend debería devolver algo como:

```json
{
  "message": "Video processed successfully",
  "original_url": "/uploads/video_123.mp4",
  "processed_url": "/processed/processed_video_123.mp4",
  "statistics": {
    "min_area": 1234.56,
    "max_area": 5678.90,
    "avg_area": 3456.78,
    "constriction_percentage": 45.2,
    "area_variance": 234.5,
    "total_frames": 120
  }
}
```

---

## Paso 5: Reiniciar el Backend

Después de hacer los cambios:

1. **Detén el servidor** (Ctrl+C en la terminal donde corre)
2. **Reinicia el servidor**:
   ```bash
   python app.py
   ```

---

## Paso 6: Probar desde la App Móvil

1. **Recarga la app** en tu iPhone (sacude → Reload)
2. **Procesa un video**
3. **Deberías ver** las nuevas secciones:
   - 📊 Estadísticas de Contracción
   - 🔍 Análisis Automático

---

## ¿Necesitas Ayuda?

Si no sabes dónde exactamente agregar el código en tu `app.py`:
1. Abre el archivo `app.py`
2. Busca donde está el código de procesamiento de video
3. Busca donde calculas el área del rombo/contorno
4. Agrega `areas_list.append(area)` ahí

Si tienes dudas sobre alguna parte específica, copia el fragmento de código relevante de tu `app.py` y te ayudo a integrarlo correctamente.
