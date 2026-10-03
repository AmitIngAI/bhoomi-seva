import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polygon, LayersControl } from "react-leaflet";
import { Search, MapPin, Loader2, AlertCircle, Navigation, Layers } from "lucide-react";
import { landRecordsAPI } from "../services/api";
import L from "leaflet";

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function DashboardMap() {
  const [searchType, setSearchType] = useState("coordinates");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [surveyNo, setSurveyNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [foundRecord, setFoundRecord] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [allRecords, setAllRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const res = await landRecordsAPI.getAll();
      setAllRecords(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    setNotFound(false);
    setFoundRecord(null);

    setTimeout(() => {
      let found = null;

      if (searchType === "coordinates") {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lng)) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        // Find record within 0.01 degrees (~1km)
        found = allRecords.find((r) => {
          const rLat = parseFloat(r.latitude);
          const rLng = parseFloat(r.longitude);
          return Math.abs(rLat - lat) < 0.01 && Math.abs(rLng - lng) < 0.01;
        });
      } else {
        // Search by survey number
        found = allRecords.find((r) => 
          r.surveyNo?.toLowerCase() === surveyNo.toLowerCase()
        );
      }

      if (found && found.latitude && found.longitude) {
        setFoundRecord(found);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 500);
  };

  // Generate polygon coordinates for plot boundary
  const getPlotBoundary = (record) => {
    if (!record?.latitude || !record?.longitude) return [];
    
    const lat = parseFloat(record.latitude);
    const lng = parseFloat(record.longitude);
    const areaSqft = parseFloat(record.landAreaSqft) || 5000;
    
    // Convert sqft to approximate lat/long offset
    // 1 degree ≈ 111km, 1 sqft ≈ 0.09 sqm
    const areaSqm = areaSqft * 0.0929;
    const sideMeters = Math.sqrt(areaSqm);
    const offset = sideMeters / 111000; // degrees
    
    return [
      [lat - offset, lng - offset],
      [lat - offset, lng + offset],
      [lat + offset, lng + offset],
      [lat + offset, lng - offset],
    ];
  };

  const defaultCenter = [21.3456, 78.0122]; // Amravati default
  const center = foundRecord && foundRecord.latitude 
    ? [parseFloat(foundRecord.latitude), parseFloat(foundRecord.longitude)]
    : defaultCenter;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-orange-500 hover:underline">Dashboard</Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700 font-semibold">GIS Map View</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-navy-800">GIS Map View (Satellite)</h1>
        <p className="text-gray-600 text-sm">Enter coordinates or survey number to view land plot</p>
      </div>

      {/* Search Panel */}
      <div className="bg-white rounded-xl shadow-lg border-t-4 border-orange-500 p-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSearchType("coordinates")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
              searchType === "coordinates"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Search by Coordinates
          </button>
          <button
            onClick={() => setSearchType("survey")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
              searchType === "survey"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Search by Survey No.
          </button>
        </div>

        {searchType === "coordinates" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Latitude</label>
              <input
                type="number" step="0.0001" value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 21.3456"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Longitude</label>
              <input
                type="number" step="0.0001" value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., 78.0122"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading || !latitude || !longitude}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shadow-md transition"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                Search Plot
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Survey Number</label>
              <input
                type="text" value={surveyNo}
                onChange={(e) => setSurveyNo(e.target.value)}
                placeholder="e.g., 123/2"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading || !surveyNo}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shadow-md transition"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                Search Plot
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-3">
          💡 Sample coordinates: <strong>Lat: 21.3456, Long: 78.0122</strong> (Amravati)
        </p>
      </div>

      {/* Not Found Message */}
      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-bold text-red-800">No Record Found</h3>
            <p className="text-sm text-red-700 mt-1">
              No land record found for the entered {searchType === "coordinates" ? "coordinates" : "survey number"}.
              Please verify and try again.
            </p>
          </div>
        </div>
      )}

      {/* Map View */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-orange-500">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="text-orange-500" size={20} />
            <h3 className="font-bold text-navy-800">
              {foundRecord ? `Plot Location - Survey No. ${foundRecord.surveyNo}` : "Interactive Satellite Map"}
            </h3>
          </div>
          {foundRecord && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold border border-yellow-300">
              🟡 Yellow border shows plot boundary
            </span>
          )}
        </div>

        <div style={{ height: "500px", width: "100%" }}>
          <MapContainer
            center={center}
            zoom={foundRecord ? 17 : 13}
            style={{ height: "100%", width: "100%" }}
            key={foundRecord ? foundRecord.recordId : "default"}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Satellite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='&copy; Esri, Maxar, Earthstar Geographics'
                  maxZoom={19}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Street">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Hybrid (Satellite + Labels)">
                <TileLayer
                  url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                  attribution='&copy; Google'
                  maxZoom={20}
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            {foundRecord && foundRecord.latitude && foundRecord.longitude && (
              <>
                <Marker position={[parseFloat(foundRecord.latitude), parseFloat(foundRecord.longitude)]}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">Survey No. {foundRecord.surveyNo}</p>
                      <p>{foundRecord.village}, {foundRecord.taluka}</p>
                      <p>Type: {foundRecord.landType}</p>
                      <p>Area: {foundRecord.landAreaSqft?.toLocaleString()} sqft</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Yellow border showing plot area */}
                <Polygon
                  positions={getPlotBoundary(foundRecord)}
                  pathOptions={{
                    color: "#FBBF24",
                    fillColor: "#FDE047",
                    fillOpacity: 0.3,
                    weight: 3,
                  }}
                />
              </>
            )}
          </MapContainer>
        </div>

        {/* Plot Details */}
        {foundRecord && (
          <div className="p-4 bg-orange-50 border-t border-orange-200">
            <h4 className="font-bold text-navy-800 mb-3">Land Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">Survey No.</p>
                <p className="font-bold text-navy-800">{foundRecord.surveyNo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Village</p>
                <p className="font-bold text-navy-800">{foundRecord.village}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Taluka</p>
                <p className="font-bold text-navy-800">{foundRecord.taluka}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Area (SqFt)</p>
                <p className="font-bold text-orange-500">{foundRecord.landAreaSqft?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Land Type</p>
                <p className="font-bold text-navy-800">{foundRecord.landType}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                to={`/document/${foundRecord.recordId}`}
                className="inline-flex items-center gap-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-semibold shadow-md"
              >
                <Navigation size={14} /> View Full Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardMap;