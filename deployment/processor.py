import cv2
import numpy as np

def calculate_statistics(areas_list):
    """Calcula estadísticas de las áreas capturadas"""
    if not areas_list or len(areas_list) == 0:
        return None
    
    # Filtrar áreas válidas (mayores a 0)
    valid_areas = [a for a in areas_list if a > 0]
    if not valid_areas:
        return None

    areas = np.array(valid_areas)
    
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
        'total_frames': len(areas_list)
    }

def calculate_polygon_area(points):
    """Calculate the area of a polygon using the Shoelace formula."""
    if len(points) < 3:
        return 0.0
    n = len(points)
    area = 0.0
    for i in range(n):
        j = (i + 1) % n
        area += points[i][0] * points[j][1]
        area -= points[j][0] * points[i][1]
    return abs(area) / 2.0

def process_video(input_path, output_path, lines_data=None):
    cap = cv2.VideoCapture(input_path)
    
    if not cap.isOpened():
    prev_gray = cv2.cvtColor(first_frame, cv2.COLOR_BGR2GRAY)
    
    # RESULTADO A RETORNAR
    processing_result = None

    if lines_data and len(lines_data) > 0:
        is_diamond_mode = (len(lines_data) == 1 and len(lines_data[0]) == 4)
        
        if is_diamond_mode:
            print("Diamond mode detected")
            diamond_points = [(int(p['x'] * width), int(p['y'] * height)) for p in lines_data[0]]
            p0 = np.array([[pt[0], pt[1]] for pt in diamond_points], dtype=np.float32).reshape(-1, 1, 2)
            
            areas = []
            tracked_vertices = []
            lk_params = dict(winSize=(21, 21), maxLevel=3, criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 20, 0.03))
            
            # FIRST PASS: Tracking
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret: break
                
                frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                
                if p0 is not None and len(p0) == 4:
                    p1, st, err = cv2.calcOpticalFlowPyrLK(prev_gray, frame_gray, p0, None, **lk_params)
                    
                    if p1 is not None and np.sum(st) == 4:
                        current_vertices = [(int(pt[0][0]), int(pt[0][1])) for pt in p1]
                        area = calculate_polygon_area(current_vertices)
                        areas.append(area)
                        tracked_vertices.append(current_vertices)
                        p0 = p1.copy()
                    else:
                        if len(tracked_vertices) > 0:
                            areas.append(areas[-1])
                            tracked_vertices.append(tracked_vertices[-1])
                
                prev_gray = frame_gray.copy()
            
            # CALCULATE STATISTICS
            stats = calculate_statistics(areas)
            processing_result = {'statistics': stats}
            
            # SECOND PASS: Visualization
            if len(areas) > 0:
                valid_areas = [a for a in areas if a > 0]
                if valid_areas:
                    max_area = max(valid_areas)
                    min_area = min(valid_areas)
                    percentages = [(a / max_area * 100) if max_area > 0 else 100 for a in areas]
                else:
                    percentages = [100] * len(areas)
                    min_area = max_area = 1

                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                
                for frame_idx in range(len(areas)):
                    ret, frame = cap.read()
                    if not ret: break
                    
                    percentage = percentages[frame_idx]
                    vertices = tracked_vertices[frame_idx]
                    
                    # Color calculation
                    normalized = (percentage - min(percentages)) / (max(percentages) - min(percentages)) if max(percentages) > min(percentages) else 1.0
                    color_b = int((1 - normalized) * 100)
                    color_g = int(normalized * 255)
                    color_r = int((1 - normalized) * 255)
                    diamond_color = (color_b, color_g, color_r)
                    
                    # Draw diamond
                    pts = np.array(vertices, dtype=np.int32).reshape((-1, 1, 2))
                    cv2.polylines(frame, [pts], True, diamond_color, 3, cv2.LINE_AA)
                    
                    # Fill
                    overlay = frame.copy()
                    cv2.fillPoly(overlay, [pts], diamond_color)
                    cv2.addWeighted(overlay, 0.2, frame, 0.8, 0, frame)
                    
                    # Vertices
                    for pt in vertices:
                        cv2.circle(frame, pt, 5, (255, 255, 255), -1)
                        cv2.circle(frame, pt, 4, diamond_color, -1)
                    
                    # Summary Panel
                    cv2.rectangle(frame, (20, 20), (300, 160), (255, 255, 255), 2)
                    cv2.putText(frame, "RESUMEN", (30, 45), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
                    cv2.putText(frame, f"Area: {percentage:.1f}%", (30, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)
                    cv2.putText(frame, f"Max: 100%", (30, 95), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
                    cv2.putText(frame, f"Min: {min(percentages):.1f}%", (30, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
                    
                    out.write(frame)
        else:
            # Polyline mode (simplificado para brevedad, mantener tu código original si lo usas)
            pass

    else:
        # Optical flow mode (simplificado)
        pass
        
    cap.release()
    out.release()
    
    return processing_result