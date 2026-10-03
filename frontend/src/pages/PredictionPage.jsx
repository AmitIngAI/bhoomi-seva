import { useState, useEffect } from "react";
import { predictionAPI } from "../services/api";
import { TrendingUp, MapPin, Home, Calculator, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";

function PredictionPage() {
  const [validValues, setValidValues] = useState({
    villages: [],
    talukas: [],
    districts: [],
    land_types: [],
    land_categories: [],
    road_connectivity_options: []
  });

  const [formData, setFormData] = useState({
    village: "",
    taluka: "Morshi",
    district: "Amravati",
    land_type: "",
    land_category: "Non-Ganded",
    road_connectivity: "Excellent",
    ready_reckoner_rate_rs_sqft: "",
    land_area_sqft: "",
    latitude: "21.345579",
    longitude: "78.012181",
    distance_highway_km: "",
    distance_city_km: "",
    distance_school_km: "",
    distance_hospital: "",
    distance_market: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadValidValues();
  }, []);

  const loadValidValues = async () => {
    try {
      const response = await predictionAPI.getValidValues();
      setValidValues(response.data);
    } catch (err) {
      console.error("Error loading valid values:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const numericData = {
        ...formData,
        ready_reckoner_rate_rs_sqft: parseFloat(formData.ready_reckoner_rate_rs_sqft),
        land_area_sqft: parseFloat(formData.land_area_sqft),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        distance_highway_km: parseFloat(formData.distance_highway_km),
        distance_city_km: parseFloat(formData.distance_city_km),
        distance_school_km: parseFloat(formData.distance_school_km),
        distance_hospital: parseFloat(formData.distance_hospital),
        distance_market: parseFloat(formData.distance_market)
      };

      const response = await predictionAPI.predict(numericData);
      setPrediction(response.data);
      
      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed. Please try again.");
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fillSampleData = () => {
    setFormData({
      village: "Morshi Rural",
      taluka: "Morshi",
      district: "Amravati",
      land_type: "Agricultural Plot",
      land_category: "Non-Ganded",
      road_connectivity: "Excellent",
      ready_reckoner_rate_rs_sqft: "350",
      land_area_sqft: "19258",
      latitude: "21.345579",
      longitude: "78.012181",
      distance_highway_km: "0.45",
      distance_city_km: "0.41",
      distance_school_km: "2.29",
      distance_hospital: "0.94",
      distance_market: "2.07"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-full mb-4">
            <TrendingUp className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-navy-900 mb-2">AI Land Value Prediction</h1>
          <p className="text-gray-600 text-lg">Get instant market valuation powered by XGBoost ML model</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl card-shadow p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-navy-900">Enter Land Details</h2>
              <button
                onClick={fillSampleData}
                className="text-sm text-primary-500 hover:underline"
              >
                Fill Sample Data
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Location Section */}
              <div className="border-l-4 border-primary-500 pl-3 mb-2">
                <h3 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
                  <MapPin size={20} /> Location
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Village *</label>
                  <select
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Village</option>
                    {validValues.villages.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                  <input
                    type="text"
                    name="taluka"
                    value={formData.taluka}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              {/* Land Details */}
              <div className="border-l-4 border-primary-500 pl-3 mb-2 mt-6">
                <h3 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
                  <Home size={20} /> Land Details
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Land Type *</label>
                  <select
                    name="land_type"
                    value={formData.land_type}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Type</option>
                    {validValues.land_types.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="land_category"
                    value={formData.land_category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {validValues.land_categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area (SqFt) *</label>
                  <input
                    type="number"
                    name="land_area_sqft"
                    value={formData.land_area_sqft}
                    onChange={handleChange}
                    placeholder="e.g., 5000"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ready Reckoner Rate *</label>
                  <input
                    type="number"
                    name="ready_reckoner_rate_rs_sqft"
                    value={formData.ready_reckoner_rate_rs_sqft}
                    onChange={handleChange}
                    placeholder="Rate per SqFt"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Road Connectivity</label>
                <select
                  name="road_connectivity"
                  value={formData.road_connectivity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {validValues.road_connectivity_options.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Distances */}
              <div className="border-l-4 border-primary-500 pl-3 mb-2 mt-6">
                <h3 className="text-lg font-semibold text-navy-900">Distances (in KM)</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highway *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="distance_highway_km"
                    value={formData.distance_highway_km}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="distance_city_km"
                    value={formData.distance_city_km}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="distance_school_km"
                    value={formData.distance_school_km}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="distance_hospital"
                    value={formData.distance_hospital}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Market *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="distance_market"
                    value={formData.distance_market}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-primary text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Predicting...
                  </>
                ) : (
                  <>
                    <Calculator size={20} />
                    Predict Land Value
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div id="result-section">
            {!prediction && !loading && !error && (
              <div className="bg-white rounded-2xl card-shadow p-8 text-center h-full flex flex-col justify-center">
                <div className="w-24 h-24 gradient-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-white" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-3">Ready to Predict!</h3>
                <p className="text-gray-600 mb-6">
                  Fill the form on the left and click "Predict Land Value" to get instant AI-powered market valuation
                </p>
                <div className="bg-blue-50 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-2">
                    <Info className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-blue-900 font-medium">Powered by XGBoost ML Model</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Trained on 1000+ records with 99.81% accuracy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl card-shadow p-8 text-center h-full flex flex-col justify-center">
                <Loader2 className="animate-spin text-primary-500 mx-auto mb-4" size={64} />
                <h3 className="text-xl font-bold text-navy-900 mb-2">Analyzing Land Value...</h3>
                <p className="text-gray-600">ML model is calculating the best estimate</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-red-600 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-red-900 mb-1">Prediction Failed</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {prediction && prediction.success && (
              <div className="space-y-4">
                {/* Main Prediction Card */}
                <div className="bg-white rounded-2xl card-shadow p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="text-green-500" size={28} />
                    <h3 className="text-2xl font-bold text-navy-900">Prediction Result</h3>
                  </div>

                  <div className="gradient-primary rounded-xl p-6 text-white mb-4">
                    <p className="text-sm opacity-90 mb-1">Predicted Market Price</p>
                    <p className="text-4xl md:text-5xl font-bold">
                      {prediction.prediction.predicted_price_formatted}
                    </p>
                    <p className="text-sm opacity-90 mt-2">
                      Range: {prediction.prediction.confidence_range_formatted}
                    </p>
                  </div>

                  {/* Comparison Card */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Government Ready Reckoner Rate</p>
                    <p className="text-2xl font-bold text-navy-900">
                      {prediction.comparison.ready_reckoner_formatted}
                    </p>
                    <div className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      prediction.comparison.market_premium_percent > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {prediction.comparison.premium_message}
                    </div>
                  </div>

                  {/* Model Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Model Information</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Model</p>
                        <p className="font-bold text-navy-900">{prediction.model_info.model_used}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Accuracy</p>
                        <p className="font-bold text-green-600">
                          {(prediction.model_info.accuracy_r2 * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Avg Error</p>
                        <p className="font-bold text-orange-600">
                          {prediction.model_info.average_error_percent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Summary */}
                <div className="bg-white rounded-2xl card-shadow p-6">
                  <h4 className="font-bold text-navy-900 mb-3">Analysis Details</h4>
                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Village</p>
                      <p className="font-semibold text-navy-900">{prediction.input_summary.village}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Land Type</p>
                      <p className="font-semibold text-navy-900">{prediction.input_summary.land_type}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Area</p>
                      <p className="font-semibold text-navy-900">{prediction.input_summary.area_sqft.toLocaleString()} sqft</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictionPage;
