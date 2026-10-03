"""
Land Value Prediction Flask API
Predicts land price based on features
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

# Load all saved artifacts
print("Loading ML model and artifacts...")
try:
    model = joblib.load("best_model.pkl")
    scaler = joblib.load("scaler.pkl")
    label_encoders = joblib.load("label_encoders.pkl")
    feature_columns = joblib.load("feature_columns.pkl")
    model_name = joblib.load("model_name.pkl")
    all_results = joblib.load("all_results.pkl")
    print(f"[OK] Model loaded: {model_name}")
    print(f"[OK] Features: {len(feature_columns)}")
except Exception as e:
    print(f"[ERROR] Failed to load model: {e}")
    exit(1)


@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "Bhoomi Seva ML Prediction API",
        "model": model_name,
        "endpoints": {
            "predict": "/api/predict (POST)",
            "model_info": "/api/model-info (GET)",
            "health": "/api/health (GET)"
        }
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model": model_name,
        "features_count": len(feature_columns)
    })


@app.route("/api/model-info", methods=["GET"])
def model_info():
    return jsonify({
        "best_model": model_name,
        "metrics": all_results,
        "features": feature_columns
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        
        # Required fields
        required_fields = [
            "village", "taluka", "district", "land_type",
            "ready_reckoner_rate_rs_sqft", "latitude", "longitude",
            "land_area_sqft", "land_category", "road_connectivity",
            "distance_highway_km", "distance_city_km", "distance_school_km",
            "distance_hospital", "distance_market"
        ]
        
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({
                "error": "Missing required fields",
                "missing_fields": missing
            }), 400
        
        # Prepare input DataFrame
        input_data = {}
        for field in required_fields:
            input_data[field] = [data[field]]
        
        input_df = pd.DataFrame(input_data)
        
        # Feature Engineering (same as training)
        input_df["log_area"] = np.log1p(input_df["land_area_sqft"])
        input_df["distance_score"] = (
            input_df["distance_highway_km"] * 0.3 +
            input_df["distance_city_km"] * 0.3 +
            input_df["distance_market"] * 0.2 +
            input_df["distance_school_km"] * 0.1 +
            input_df["distance_hospital"] * 0.1
        )
        
        # Encode categorical variables
        categorical_cols = ["village", "taluka", "district", "land_type",
                            "land_category", "road_connectivity"]
        
        for col in categorical_cols:
            le = label_encoders[col]
            try:
                input_df[col] = le.transform(input_df[col].astype(str))
            except ValueError:
                return jsonify({
                    "error": f"Unknown value for {col}: {data[col]}",
                    "valid_values": le.classes_.tolist()
                }), 400
        
        # Reorder columns to match training
        input_df = input_df[feature_columns]
        
        # Make prediction
        if model_name == "Linear Regression":
            input_scaled = scaler.transform(input_df)
            prediction = model.predict(input_scaled)[0]
        else:
            prediction = model.predict(input_df)[0]
        
        # Calculate confidence range (based on MAPE)
        mape = all_results[model_name]["MAPE"] / 100
        confidence_min = prediction * (1 - mape)
        confidence_max = prediction * (1 + mape)
        
        # Compare with ready reckoner
        ready_reckoner_estimate = data["ready_reckoner_rate_rs_sqft"] * data["land_area_sqft"]
        market_premium = ((prediction - ready_reckoner_estimate) / ready_reckoner_estimate) * 100
        
        return jsonify({
            "success": True,
            "prediction": {
                "predicted_price": round(float(prediction), 2),
                "confidence_min": round(float(confidence_min), 2),
                "confidence_max": round(float(confidence_max), 2),
                "predicted_price_formatted": f"Rs {prediction:,.0f}",
                "confidence_range_formatted": f"Rs {confidence_min:,.0f} - Rs {confidence_max:,.0f}"
            },
            "comparison": {
                "ready_reckoner_estimate": round(float(ready_reckoner_estimate), 2),
                "ready_reckoner_formatted": f"Rs {ready_reckoner_estimate:,.0f}",
                "market_premium_percent": round(float(market_premium), 2),
                "premium_message": f"{market_premium:+.1f}% vs Government Rate"
            },
            "model_info": {
                "model_used": model_name,
                "accuracy_r2": round(all_results[model_name]["R2"], 4),
                "average_error_percent": round(all_results[model_name]["MAPE"], 2)
            },
            "input_summary": {
                "village": data["village"],
                "land_type": data["land_type"],
                "area_sqft": data["land_area_sqft"]
            }
        })
        
    except Exception as e:
        return jsonify({
            "error": "Prediction failed",
            "details": str(e)
        }), 500


@app.route("/api/valid-values", methods=["GET"])
def valid_values():
    """Returns valid values for categorical fields"""
    return jsonify({
        "villages": label_encoders["village"].classes_.tolist(),
        "talukas": label_encoders["taluka"].classes_.tolist(),
        "districts": label_encoders["district"].classes_.tolist(),
        "land_types": label_encoders["land_type"].classes_.tolist(),
        "land_categories": label_encoders["land_category"].classes_.tolist(),
        "road_connectivity_options": label_encoders["road_connectivity"].classes_.tolist()
    })


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("BHOOMI SEVA ML API STARTING")
    print("=" * 60)
    print(f"Model: {model_name}")
    print(f"Features: {len(feature_columns)}")
    print("Server: http://localhost:5000")
    print("=" * 60 + "\n")
    app.run(host="0.0.0.0", port=5000, debug=False)
