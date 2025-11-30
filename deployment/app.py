import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from processor import process_video
import uuid
import json

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/', methods=['GET'])
def home():
    return "<h1>FaringoApp Backend is Running! 🚀</h1><p>Use /health to check status.</p>"

@app.route('/privacy', methods=['GET'])
def privacy_policy():
    return send_from_directory('.', 'PRIVACY_POLICY.html')

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
    
    lines = []
    if 'lines' in request.form:
        try:
            lines = json.loads(request.form['lines'])
        except:
            print("Error parsing lines")
    
    output_filename = "processed_" + filename
    output_path = os.path.join(PROCESSED_FOLDER, output_filename)
    
    try:
        # Process video and get result (which includes statistics)
        result = process_video(input_path, output_path, lines)
        
        statistics = None
        if result and 'statistics' in result:
            statistics = result['statistics']
        
        return jsonify({
            'message': 'Video processed successfully',
            'original_url': f'/uploads/{filename}',
            'processed_url': f'/processed/{output_filename}',
            'statistics': statistics
        })
    except Exception as e:
        print(f"Error processing video: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/processed/<filename>')
def processed_file(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)