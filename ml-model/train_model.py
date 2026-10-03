"""
Land Value Prediction Model Training - FIXED VERSION
No data leakage - uses only real features
"""

import pandas as pd
import numpy as np
import mysql.connector
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import xgboost as xgb
import joblib
import warnings
warnings.filterwarnings("ignore")

print("=" * 70)
print("BHOOMI SEVA - LAND VALUE PREDICTION (IMPROVED)")
print("=" * 70)

# STEP 1: Load Data
print("\n[1/7] Loading data from MySQL...")
try:
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="AMIT@AI00",
        database="bhoomi_seva_db"
    )
    query = """
    SELECT village, taluka, district, land_type,
           ready_reckoner_rate_rs_sqft, latitude, longitude, land_area_sqft,
           land_category, road_connectivity, distance_highway_km,
           distance_city_km, distance_school_km, distance_hospital,
           distance_market, current_market_price
    FROM land_records
    """
    df = pd.read_sql(query, connection)
    connection.close()
    print(f"[OK] Loaded {len(df)} records")
except Exception as e:
    print(f"[ERROR] Database error: {e}")
    exit(1)

# STEP 2: Feature Engineering
print("\n[2/7] Feature Engineering...")
df["price_per_sqft"] = df["current_market_price"] / df["land_area_sqft"]
df["log_area"] = np.log1p(df["land_area_sqft"])
df["distance_score"] = (
    df["distance_highway_km"] * 0.3 +
    df["distance_city_km"] * 0.3 +
    df["distance_market"] * 0.2 +
    df["distance_school_km"] * 0.1 +
    df["distance_hospital"] * 0.1
)
print(f"[OK] Features engineered. Shape: {df.shape}")

# STEP 3: Preprocess
print("\n[3/7] Preprocessing...")
df = df.fillna(df.median(numeric_only=True))

label_encoders = {}
categorical_cols = ["village", "taluka", "district", "land_type",
                    "land_category", "road_connectivity"]
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le

# Drop price_per_sqft (leaky feature) - only used for validation
df = df.drop(["price_per_sqft"], axis=1)
print("[OK] Data preprocessed")

# STEP 4: Split Data
print("\n[4/7] Splitting data...")
target = "current_market_price"
X = df.drop([target], axis=1)
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print(f"[OK] Training: {X_train.shape}, Testing: {X_test.shape}")
print(f"[OK] Features used: {list(X.columns)}")

# STEP 5: Train Models
print("\n[5/7] Training models...")
models = {
    "Linear Regression": LinearRegression(),
    "Decision Tree": DecisionTreeRegressor(random_state=42, max_depth=15),
    "Random Forest": RandomForestRegressor(
        n_estimators=200, random_state=42, max_depth=20, min_samples_split=5
    ),
    "XGBoost": xgb.XGBRegressor(
        n_estimators=200, learning_rate=0.1, max_depth=8, random_state=42
    )
}

results = {}
best_model = None
best_score = -float("inf")
best_model_name = None

for name, model in models.items():
    print(f"\n  Training {name}...")
    if name == "Linear Regression":
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
    else:
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    # Percentage error
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

    results[name] = {"MAE": mae, "RMSE": rmse, "R2": r2, "MAPE": mape}

    print(f"    MAE:  Rs {mae:,.2f}")
    print(f"    RMSE: Rs {rmse:,.2f}")
    print(f"    R2:   {r2:.4f}")
    print(f"    MAPE: {mape:.2f}%")

    if r2 > best_score:
        best_score = r2
        best_model = model
        best_model_name = name

# STEP 6: Display Results
print("\n[6/7] Model Comparison:")
print("-" * 80)
print(f"{'Model':<20} {'MAE (Rs)':<18} {'RMSE (Rs)':<18} {'R2':<10} {'MAPE':<10}")
print("-" * 80)
for name, m in results.items():
    print(f"{name:<20} {m['MAE']:<18,.2f} {m['RMSE']:<18,.2f} {m['R2']:<10.4f} {m['MAPE']:<10.2f}%")
print("-" * 80)
print(f"\n[WINNER] Best Model: {best_model_name}")
print(f"         R2 Score: {best_score:.4f}")
print(f"         Average Error: Rs {results[best_model_name]['MAE']:,.2f}")
print(f"         Percentage Error: {results[best_model_name]['MAPE']:.2f}%")

# STEP 7: Save Best Model
print("\n[7/7] Saving model...")
joblib.dump(best_model, "best_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(label_encoders, "label_encoders.pkl")
joblib.dump(list(X.columns), "feature_columns.pkl")
joblib.dump(best_model_name, "model_name.pkl")
joblib.dump(results, "all_results.pkl")

print("[OK] All files saved!")

# Sample predictions
print("\n" + "=" * 70)
print("SAMPLE PREDICTIONS (Test Set):")
print("=" * 70)
sample_indices = np.random.choice(len(X_test), 5, replace=False)
for idx in sample_indices:
    if best_model_name == "Linear Regression":
        pred = best_model.predict(X_test_scaled[idx:idx+1])[0]
    else:
        pred = best_model.predict(X_test.iloc[idx:idx+1])[0]
    actual = y_test.iloc[idx]
    diff_pct = ((pred - actual) / actual) * 100
    print(f"Actual: Rs {actual:>15,.0f}  |  Predicted: Rs {pred:>15,.0f}  |  Diff: {diff_pct:+.2f}%")

print("\n" + "=" * 70)
print("TRAINING COMPLETE!")
print("=" * 70)
