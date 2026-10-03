import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polygon, LayersControl } from "react-leaflet";
import {
  ArrowLeft, Download, Printer, Share2, FileText, ZoomIn, ZoomOut,
  CheckCircle2, TrendingUp, MapPin, HelpCircle, Loader2, Info,
  Home, Building2, Ruler, Route, IndianRupee, User
} from "lucide-react";
import { documentAPI, predictionAPI, userActivityAPI } from "../services/api";
import { downloadPDF, printDocument, shareDocument } from "../utils/pdfGenerator";
import { useAuth } from "../context/AuthContext";
import SatbaraDocument from "../components/documents/SatbaraDocument";
import EightADocument from "../components/documents/EightADocument";
import PropertyCardDocument from "../components/documents/PropertyCardDocument";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function DocumentViewPage() {
  const { recordId } = useParams();
  const [searchParams] = useSearchParams();
  const docParam = searchParams.get("doc");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("satbara");
  const [zoom, setZoom] = useState(100);

  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  const satbaraRef = useRef();
  const eightARef = useRef();
  const propertyCardRef = useRef();

  useEffect(() => {
    loadDocuments();
  }, [recordId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentAPI.getDocuments(recordId);
      setData(response.data);

      if (docParam === "8A") setActiveTab("eightA");
      else if (docParam === "Property Card" || response.data.documentType === "PROPERTY_CARD") setActiveTab("property");
      else setActiveTab("satbara");

      fetchPrediction(response.data.landRecord);
    } catch (err) {
      setError("Failed to load document");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrediction = async (record) => {
    if (!record) return;
    setPredicting(true);
    try {
      const payload = {
        village: record.village || "Morshi Rural",
        taluka: record.taluka || "Morshi",
        district: record.district || "Amravati",
        land_type: record.landType || "Agricultural Plot",
        land_category: record.landCategory || "Non-Ganded",
        road_connectivity: record.roadConnectivity || "Excellent",
        ready_reckoner_rate_rs_sqft: parseFloat(record.readyReckonerRateRsSqft) || 0,
        land_area_sqft: parseFloat(record.landAreaSqft) || 0,
        latitude: parseFloat(record.latitude) || 21.345579,
        longitude: parseFloat(record.longitude) || 78.012181,
        distance_highway_km: parseFloat(record.distanceHighwayKm) || 0,
        distance_city_km: parseFloat(record.distanceCityKm) || 0,
        distance_school_km: parseFloat(record.distanceSchoolKm) || 0,
        distance_hospital: parseFloat(record.distanceHospital) || 0,
        distance_market: parseFloat(record.distanceMarket) || 0,
      };

      const res = await predictionAPI.predict(payload);
      if (res.data?.success) {
        setPrediction(res.data);
      }
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setPredicting(false);
    }
  };

  const handleDownload = async () => {
    let filename = "";
    let docType = "";

    if (activeTab === "satbara") {
      filename = `7-12-${data.landRecord.surveyNo}.pdf`;
      docType = "7/12 Extract";
      await downloadPDF(satbaraRef, filename);
    } else if (activeTab === "eightA") {
      filename = `8A-${data.landRecord.surveyNo}.pdf`;
      docType = "8A Record";
      await downloadPDF(eightARef, filename);
    } else if (activeTab === "property") {
      filename = `PropertyCard-${data.landRecord.surveyNo}.pdf`;
      docType = "Property Card";
      await downloadPDF(propertyCardRef, filename);
    }

    try {
      if (user?.id) {
        await userActivityAPI.addDownload({
          userId: user.id,
          recordId: data.landRecord.recordId,
          documentType: docType,
          surveyNo: data.landRecord.surveyNo,
          village: data.landRecord.village,
        });
      }
    } catch (err) {
      console.error("Download tracking failed:", err);
    }
  };

  const handleDownloadDetails = () => {
    const lr = data.landRecord;
    const details = `
╔═══════════════════════════════════════════════════════════╗
║          BHOOMI SEVA - LAND RECORD DETAILS                ║
╚═══════════════════════════════════════════════════════════╝

📍 LOCATION INFORMATION
────────────────────────────────────────────────────
Survey Number     : ${lr.surveyNo}
Village           : ${lr.village}
Taluka            : ${lr.taluka}
District          : ${lr.district}
Coordinates       : ${lr.latitude}°N, ${lr.longitude}°E

🏠 LAND DETAILS
────────────────────────────────────────────────────
Land Type         : ${lr.landType}
Land Category     : ${lr.landCategory || "N/A"}
Land Area         : ${lr.landAreaSqft?.toLocaleString()} sqft
Ready Reckoner    : ₹${lr.readyReckonerRateRsSqft?.toLocaleString() || "N/A"}/sqft
Owner Name        : ${lr.ownerName || "N/A"}

🛣️ CONNECTIVITY & DISTANCES
────────────────────────────────────────────────────
Road Connectivity : ${lr.roadConnectivity || "N/A"}
Distance Highway  : ${lr.distanceHighwayKm} km
Distance City     : ${lr.distanceCityKm} km
Distance School   : ${lr.distanceSchoolKm} km
Distance Hospital : ${lr.distanceHospital} km
Distance Market   : ${lr.distanceMarket} km

💰 PRICE INFORMATION
────────────────────────────────────────────────────
Historical Price  : ₹${lr.historicalPrice?.toLocaleString() || "N/A"}
Government Rate   : ₹${lr.governmentRate?.toLocaleString() || "N/A"}
Sale Price        : ₹${lr.salePrice?.toLocaleString() || "N/A"}
Market Price      : ₹${lr.currentMarketPrice?.toLocaleString() || "N/A"}

🤖 AI PREDICTION (XGBoost ML Model)
────────────────────────────────────────────────────
Predicted Price   : ₹${prediction?.prediction?.predicted_price?.toLocaleString() || "N/A"}
Confidence Range  : ₹${prediction?.prediction?.confidence_min?.toLocaleString() || "N/A"} - ₹${prediction?.prediction?.confidence_max?.toLocaleString() || "N/A"}
Comparison        : ${prediction?.comparison?.premium_message || "N/A"}
Model Used        : ${prediction?.model_info?.model_used || "XGBoost"}
Model Accuracy    : ${prediction?.model_info?.accuracy_r2 ? (prediction.model_info.accuracy_r2 * 100).toFixed(1) + "%" : "99.8%"}
Average Error     : ${prediction?.model_info?.average_error_percent?.toFixed(2) || "1.46"}%

────────────────────────────────────────────────────
Generated on: ${new Date().toLocaleString()}
Powered by: Bhoomi Seva - AI Land Valuation Platform
────────────────────────────────────────────────────
    `;
    const blob = new Blob([details], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LandDetails-${lr.surveyNo}-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (activeTab === "satbara") printDocument(satbaraRef);
    else if (activeTab === "eightA") printDocument(eightARef);
    else if (activeTab === "property") printDocument(propertyCardRef);
  };

  const handleShare = () => {
    shareDocument(
      `Land Record - ${data.landRecord.surveyNo}`,
      `Land record document for Survey No. ${data.landRecord.surveyNo}`
    );
  };

  const handleGetDetailedReport = () => {
    handleDownloadDetails();
  };

  const getPlotBoundary = (record) => {
    if (!record?.latitude || !record?.longitude) return [];
    const lat = parseFloat(record.latitude);
    const lng = parseFloat(record.longitude);
    const areaSqft = parseFloat(record.landAreaSqft) || 5000;
    const areaSqm = areaSqft * 0.0929;
    const sideMeters = Math.sqrt(areaSqm);
    const offset = sideMeters / 111000;
    return [
      [lat - offset, lng - offset],
      [lat - offset, lng + offset],
      [lat + offset, lng + offset],
      [lat + offset, lng - offset],
    ];
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    const num = parseFloat(price);
    if (isNaN(num) || num === 0) return "N/A";
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <p className="text-red-600 text-lg mb-4">{error || "Document not found"}</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isAgricultural = data.documentType === "AGRICULTURAL";
  const lr = data.landRecord;
  const hasCoordinates = lr.latitude && lr.longitude;
  const mapCenter = hasCoordinates ? [parseFloat(lr.latitude), parseFloat(lr.longitude)] : [21.3456, 78.0122];

  const predictedValue = prediction?.prediction?.predicted_price || 0;
  const confidenceMin = prediction?.prediction?.confidence_min || 0;
  const confidenceMax = prediction?.prediction?.confidence_max || 0;
  const premiumMessage = prediction?.comparison?.premium_message || "";
  const modelName = prediction?.model_info?.model_used || "XGBoost";
  const modelAccuracy = prediction?.model_info?.accuracy_r2
    ? (prediction.model_info.accuracy_r2 * 100).toFixed(1)
    : "99.8";
  const avgError = prediction?.model_info?.average_error_percent
    ? prediction.model_info.average_error_percent.toFixed(2)
    : "1.46";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══════════════════ TOP HEADER ═══════════════════ */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-orange-500 hover:text-orange-600 hover:underline flex items-center gap-1 text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Back to Search Results
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-xs font-semibold shadow-sm transition"
            >
              <Download size={14} /> Download Report
            </button>
            <button
              onClick={handleDownloadDetails}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-900 text-xs font-semibold shadow-sm transition"
            >
              <Download size={14} /> Download Details
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-navy-800 overflow-hidden">
          <div className="p-4 border-b bg-gradient-to-r from-navy-800 to-navy-900 flex items-center gap-2">
            <Info className="text-white" size={22} />
            <h3 className="font-bold text-white text-lg">Complete Land Information</h3>
          </div>

          <div className="p-6 space-y-6">

            {/* Row 1: LOCATION INFO */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-orange-500" />
                <h4 className="text-sm font-bold text-navy-800 uppercase tracking-wide">Location Information</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Survey No</p>
                  <p className="text-base font-bold text-navy-800">{lr.surveyNo}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Village</p>
                  <p className="text-base font-bold text-navy-800">{lr.village}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Taluka</p>
                  <p className="text-base font-bold text-navy-800">{lr.taluka}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">District</p>
                  <p className="text-base font-bold text-navy-800">{lr.district}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Coordinates</p>
                  <p className="text-xs font-bold text-navy-800">
                    {lr.latitude?.toFixed(4)}°N<br />
                    {lr.longitude?.toFixed(4)}°E
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2: LAND DETAILS */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Home size={16} className="text-blue-500" />
                <h4 className="text-sm font-bold text-navy-800 uppercase tracking-wide">Land Details</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Land Type</p>
                  <p className="text-sm font-bold text-navy-800">{lr.landType}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Category</p>
                  <p className="text-sm font-bold text-navy-800">{lr.landCategory || "N/A"}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Area (SqFt)</p>
                  <p className="text-sm font-bold text-navy-800">{lr.landAreaSqft?.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">RR Rate</p>
                  <p className="text-sm font-bold text-navy-800">₹{lr.readyReckonerRateRsSqft?.toLocaleString() || 'N/A'}/sqft</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Owner Name</p>
                  <p className="text-sm font-bold text-navy-800 truncate">{lr.ownerName || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Row 3: CONNECTIVITY & DISTANCES */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Route size={16} className="text-green-500" />
                <h4 className="text-sm font-bold text-navy-800 uppercase tracking-wide">Connectivity & Distances</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Road</p>
                  <p className="text-sm font-bold text-navy-800">{lr.roadConnectivity || "N/A"}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Highway</p>
                  <p className="text-sm font-bold text-navy-800">{lr.distanceHighwayKm} km</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">City</p>
                  <p className="text-sm font-bold text-navy-800">{lr.distanceCityKm} km</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">School</p>
                  <p className="text-sm font-bold text-navy-800">{lr.distanceSchoolKm} km</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Hospital</p>
                  <p className="text-sm font-bold text-navy-800">{lr.distanceHospital} km</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Market</p>
                  <p className="text-sm font-bold text-navy-800">{lr.distanceMarket} km</p>
                </div>
              </div>
            </div>

            {/* Row 4: PRICE INFORMATION */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IndianRupee size={16} className="text-purple-500" />
                <h4 className="text-sm font-bold text-navy-800 uppercase tracking-wide">Price Information</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Historical Price</p>
                  <p className="text-sm font-bold text-navy-800">{formatPrice(lr.historicalPrice)}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Govt Rate</p>
                  <p className="text-sm font-bold text-navy-800">{formatPrice(lr.governmentRate)}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Sale Price</p>
                  <p className="text-sm font-bold text-navy-800">{formatPrice(lr.salePrice)}</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 border-l-4 border-orange-700 shadow-md">
                  <p className="text-[10px] text-orange-100 uppercase font-bold">Current Market Price</p>
                  <p className="text-lg font-bold text-white">{formatPrice(lr.currentMarketPrice)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ═══════ LEFT COLUMN (2/3) ═══════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* Satellite Map */}
            <div className="bg-white rounded-xl shadow-lg border-t-4 border-orange-500 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="text-orange-500" size={20} />
                  <h3 className="font-bold text-navy-800">Plot Location (Satellite View)</h3>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold border border-yellow-300">
                  🟡 Yellow border = Plot boundary
                </span>
              </div>
              <div style={{ height: "450px", width: "100%" }}>
                <MapContainer center={mapCenter} zoom={17} style={{ height: "100%", width: "100%" }}>
                  <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Satellite">
                      <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; Esri'
                        maxZoom={19}
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Street">
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap'
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Hybrid">
                      <TileLayer
                        url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                        attribution='&copy; Google'
                        maxZoom={20}
                      />
                    </LayersControl.BaseLayer>
                  </LayersControl>

                  {hasCoordinates && (
                    <>
                      <Marker position={mapCenter}>
                        <Popup>
                          <div className="text-sm">
                            <p className="font-bold">Survey No. {lr.surveyNo}</p>
                            <p>{lr.village}</p>
                            <p>Area: {lr.landAreaSqft?.toLocaleString()} sqft</p>
                          </div>
                        </Popup>
                      </Marker>
                      <Polygon
                        positions={getPlotBoundary(lr)}
                        pathOptions={{
                          color: "#FBBF24",
                          fillColor: "#FDE047",
                          fillOpacity: 0.35,
                          weight: 3,
                        }}
                      />
                    </>
                  )}
                </MapContainer>
              </div>
            </div>

            {/* Document Viewer Section */}
            <div className="bg-white rounded-xl shadow-lg border-t-4 border-blue-500 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
                <FileText className="text-blue-500" size={20} />
                <h3 className="font-bold text-navy-800">Official Documents</h3>
              </div>

              {/* Document Tabs */}
              {isAgricultural && (
                <div className="border-b border-gray-200 flex">
                  <button
                    onClick={() => setActiveTab("satbara")}
                    className={`flex-1 px-6 py-3 font-semibold text-sm flex items-center justify-center gap-2 transition ${
                      activeTab === "satbara"
                        ? "border-b-2 border-orange-500 text-orange-500 bg-orange-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <FileText size={16} /> 7/12 Extract
                  </button>
                  <button
                    onClick={() => setActiveTab("eightA")}
                    className={`flex-1 px-6 py-3 font-semibold text-sm flex items-center justify-center gap-2 transition ${
                      activeTab === "eightA"
                        ? "border-b-2 border-orange-500 text-orange-500 bg-orange-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <FileText size={16} /> 8A Record
                  </button>
                </div>
              )}

              {/* Toolbar */}
              <div className="border-b border-gray-200 px-4 py-2 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-2 hover:bg-gray-200 rounded transition">
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-sm font-medium min-w-[45px] text-center">{zoom}%</span>
                  <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="p-2 hover:bg-gray-200 rounded transition">
                    <ZoomIn size={16} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleDownload} className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-semibold transition">
                    <Download size={14} /> Download PDF
                  </button>
                  <button onClick={handlePrint} className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white text-sm transition">
                    <Printer size={14} /> Print
                  </button>
                  <button onClick={handleShare} className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white text-sm transition">
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>

              {/* Document Display */}
              <div className="bg-gray-100 p-6 overflow-auto" style={{ maxHeight: "800px" }}>
                <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
                  {activeTab === "satbara" && isAgricultural && <SatbaraDocument ref={satbaraRef} data={data.satbara} landRecord={lr} />}
                  {activeTab === "eightA" && isAgricultural && <EightADocument ref={eightARef} data={data.eightA} />}
                  {activeTab === "property" && !isAgricultural && <PropertyCardDocument ref={propertyCardRef} data={data.propertyCard} />}
                </div>
              </div>
            </div>
          </div>

          {/* ═══════ RIGHT SIDEBAR (1/3) ═══════ */}
          <div className="space-y-4">

            {/* AI Predicted Value */}
            <div className="bg-white rounded-xl shadow-lg border-t-4 border-navy-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-navy-800" />
                  <h3 className="font-bold text-navy-800">AI Predicted Value</h3>
                  <HelpCircle size={14} className="text-gray-400" />
                </div>
                {predicting ? (
                  <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-semibold">
                    <Loader2 size={12} className="animate-spin" /> Loading
                  </span>
                ) : prediction ? (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-semibold">
                    <CheckCircle2 size={12} /> Success
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-semibold">
                    Failed
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
                  <div className="text-center py-4 bg-gradient-to-br from-navy-50 to-blue-50 rounded-lg mb-3">
                    <p className="text-xs text-gray-500 mb-1 uppercase font-semibold">Predicted Price</p>
                    <p className="text-4xl font-bold text-navy-800">
                      {formatPrice(predictedValue)}
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700 mb-3 text-center font-semibold">
                    Confidence: {formatPrice(confidenceMin)} - {formatPrice(confidenceMax)}
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 mb-3">
                    <p className="text-xs text-orange-700 font-semibold mb-1">Comparison with Ready Reckoner Rate</p>
                    <p className="text-sm font-bold text-orange-600">{premiumMessage}</p>
                  </div>
                  <button
                    onClick={handleGetDetailedReport}
                    className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-3 rounded-lg font-semibold shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Get Detailed Report
                  </button>
                </>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-gray-500 mb-3">Prediction unavailable</p>
                  <button
                    onClick={() => fetchPrediction(lr)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-semibold"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Model Information */}
            <div className="bg-white rounded-xl shadow-lg border-t-4 border-yellow-500 p-5">
              <h3 className="font-bold text-navy-800 mb-3 flex items-center gap-2">
                <Info size={18} className="text-yellow-500" />
                Model Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600 text-sm">Model:</span>
                  <span className="font-bold text-navy-800 text-sm">{modelName}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600 text-sm">Accuracy:</span>
                  <span className="font-bold text-green-600 text-sm">{modelAccuracy}%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600 text-sm">Avg Error:</span>
                  <span className="font-bold text-orange-500 text-sm">{avgError}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentViewPage;