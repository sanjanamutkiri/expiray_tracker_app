# ml-api/train_model.py
import pickle
import numpy as np
import os
from sklearn.ensemble import RandomForestRegressor

def train_dummy_model():
    """
    Train a simple RandomForest model as a placeholder.
    In a real application, this would use actual training data.
    """
    # Mock training data - [food_category_encoded, storage_type_encoded]
    # Categories: 0=dairy, 1=meat, 2=vegetables, 3=fruits, 4=bakery, 5=canned, 6=frozen
    # Storage: 0=refrigerator, 1=freezer, 2=pantry, 3=countertop
    X = np.array([
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 3], [5, 2], [6, 1], [0, 1],
        [1, 1], [2, 3], [4, 2], [5, 3]
    ])
    
    # Mock expiry days
    y = np.array([7, 3, 5, 7, 4, 365, 180, 30, 90, 3, 14, 60])
    
    # Train a RandomForest model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'model', 'expiry_predictor.pkl')
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_dummy_model()
