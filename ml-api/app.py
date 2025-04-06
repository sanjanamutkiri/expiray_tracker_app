from flask import Flask, request, jsonify
import pickle
import os
import numpy as np
from datetime import datetime, timedelta

app = Flask(__name__)

# Load your ML model
MODEL_PATH = 'model.pkl'  # Replace with the actual model path

if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, 'rb') as model_file:
        model = pickle.load(model_file)
else:
    model = None
    print("⚠️ Model file not found!")

@app.route('/')
def home():
    return "✅ ML API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.json  # Expecting JSON input like {"features": [1, 2, 3]}
        features = np.array(data['features']).reshape(1, -1)
        prediction = model.predict(features)
        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
