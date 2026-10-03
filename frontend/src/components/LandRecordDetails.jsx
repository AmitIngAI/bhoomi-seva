import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Download, HelpCircle, CheckCircle, TrendingUp, Loader2 } from "lucide-react";
import { landRecordsAPI, predictionAPI } from "../services/api";
import L from "leaflet";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function LandRecordDetails({ record }) {
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    if (record) {
      getPrediction();
    }
  }, [record]);

  const getPrediction = async () => {
    if (!record) return;
    setPredicting(true);
    try {
      const data = {
        village: record.village,
        taluka: record.taluka,
        district: record.district,
        land_type: record.landType,
        ready_reckoner_rate_rs_sqft: record.readyReckonerRateRsSqft,
        latitude: record.latitude,
        longitude: record.longitude,
        land_area_sqft: record.landAreaSqft,
        land_category: record.landCategory,
        road_connectivity: record.roadConnectivity,
        distance_highway_km: record.distanceHighwayKm,
        distance_city_km: record.distanceCityKm,
        distance_school_km: record.distanceSchoolKm,
        distance_hospital: record.distanceHospital,
        distance_market: record.distanceMarket
      };
      const response = await predictionAPI.predict(data);
      setPrediction(response.data);
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setPredicting(false);
    }
  };

  if (!record) {
    return (
      <div className="bg-white rounded-xl p-12 text-center card-shadow">
        <p className="text-gray-500">Select a record to view details</p>
      </div>
    );
  }

  const position = [record.latitude || 21.3373, record.longitude || 78.0084];

  return (
    <div className="space-y-6">
      {/* Land Record Info Card */}
      <div className="bg-white rounded-xl card-shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          <div className="md:col-span-4 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Survey No</p>
                <p className="font-bold text-navy-800">{record.surveyNo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Village</p>
                <p className="font-bold text-navy-800">{record.village}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Taluka</p>
                <p className="font-bold text-navy-800">{record.taluka}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">District</p>
                <p className="font-bold text-navy-800">{record.district}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 mb-1">Land Type</p>
                <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded">
                  {record.landType}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="font-semibold text-navy-800 text-sm">{record.landCategory}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Area (SqFt)</p>
                <p className="font-bold text-navy-800">{record.landAreaSqft?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Coordinates</p>
                <p className="font-semibold text-navy-800 text-xs">
                  {record.latitude?.toFixed(4)}Â°N, {record.longitude?.toFixed(4)}Â°E
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-3 bg-gray-50">
            <button className="gradient-orange text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 text-sm">
              <Download size={18} />
              Download Report
            </button>
            <button className="bg-navy-800 text-white px-4 py-3 rounded-lg font-semibold hover:bg-navy-900 transition flex items-center justify-center gap-2 text-sm">
              <Download size={18} />
              Download Details
            </button>
          </div>
        </div>
      </div>

      {/* Map + Prediction Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white rounded-xl card-shadow p-6">
          <h3 className="text-lg font-bold text-navy-800 mb-4">Plot Location</h3>
          <MapContainer center={position} zoom={13} className="leaflet-container">
            <TileLayer
              attribution="Â© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                <div className="font-semibold">{record.village}</div>
                <div className="text-xs">Survey: {record.surveyNo}</div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* AI Prediction Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl card-shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-navy-800">AI Predicted Value</h3>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              {prediction && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                  <CheckCircle size={12} /> Success
                </span>
              )}
            </div>

            {predicting ? (
              <div className="py-8 text-center">
                <Loader2 className="animate-spin text-orange-500 mx-auto mb-3" size={40} />
                <p className="text-sm text-gray-600">AI is analyzing...</p>
              </div>
            ) : prediction ? (
              <>
                <p className="text-xs text-gray-500 mb-1">Predicted Price</p>
                <p className="text-4xl font-bold text-navy-800 mb-2">
                   {(prediction.prediction.predicted_price / 100000).toFixed(2)}L
                </p>
                <div className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded inline-block mb-4">
                  Confidence:  {(prediction.prediction.confidence_min / 100000).toFixed(1)}L -  {(prediction.prediction.confidence_max / 100000).toFixed(1)}L
                </div>

                <div className="bg-orange-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 mb-1">Comparison with Ready Reckoner Rate</p>
                  <p className="text-sm font-bold text-orange-700">
                    {prediction.comparison.premium_message}
                  </p>
                </div>

                <button className="w-full gradient-orange text-white py-3 rounded-lg font-semibold hover:opacity-90 transition text-sm">
                  Get Detailed Report
                </button>
              </>
            ) : (
              <button
                onClick={getPrediction}
                className="w-full gradient-orange text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <TrendingUp size={18} />
                Predict Value
              </button>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-xl card-shadow p-6">
            <h4 className="font-bold text-navy-800 mb-3 text-sm">Model Information</h4>
            {prediction && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Model:</span>
                  <span className="font-semibold text-navy-800">{prediction.model_info.model_used}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Accuracy:</span>
                  <span className="font-semibold text-green-600">
                    {(prediction.model_info.accuracy_r2 * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg Error:</span>
                  <span className="font-semibold text-orange-600">
                    {prediction.model_info.average_error_percent.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandRecordDetails;
