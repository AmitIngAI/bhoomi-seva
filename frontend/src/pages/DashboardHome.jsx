import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polygon, LayersControl } from "react-leaflet";
import {
  FileText, FileBadge, TrendingUp, Bell, Search, MapPin,
  Download, CheckCircle, Info, Radio, Settings,
  Calendar, ChevronRight, Loader2, Building2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userActivityAPI } from "../services/api";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRecords: 0,
    satbaraCount: 0,
    eightACount: 0,
    propertyCardCount: 0,
    predictionCount: 0,
    downloadCount: 0,
    recentRecords: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await userActivityAPI.getDashboardStats(user.id);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const notifications = [
    { icon: CheckCircle, color: "text-green-600 bg-green-100", title: "Mutation request approved", subtitle: `Survey No. ${stats.recentRecords[0]?.surveyNo || "N/A"}`, time: "2 days ago" },
    { icon: Info, color: "text-blue-600 bg-blue-100", title: "New notification from Department", subtitle: "Check details", time: "5 days ago" },
    { icon: Radio, color: "text-orange-600 bg-orange-100", title: "Ready Reckoner rates updated", subtitle: "Click to view updated rates", time: "8 days ago" },
    { icon: Settings, color: "text-purple-600 bg-purple-100", title: "System Maintenance Scheduled", subtitle: "On 25 May 2024, 10:00 PM", time: "10 days ago" },
  ];

  // Get first record with coordinates for map
  const firstRecordWithCoords = stats.recentRecords.find(r => r.latitude && r.longitude);
  const mapCenter = firstRecordWithCoords
    ? [parseFloat(firstRecordWithCoords.latitude), parseFloat(firstRecordWithCoords.longitude)]
    : [21.3456, 78.0122];

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

  const registeredDate = user?.createdAt 
  ? new Date(user.createdAt).toLocaleDateString("en-IN", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric" 
    })
  : "Not Available";
  
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 rounded-xl shadow-xl p-6 relative overflow-hidden border-b-4 border-orange-600">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-2">
              <p className="text-sm text-white font-semibold">🙏 Welcome Back,</p>
            </div>
            <h1 className="text-4xl font-bold font-hindi text-white mt-1 drop-shadow-lg">
              {user?.fullName || user?.name || "User"}!
            </h1>
            <p className="text-sm text-white/90 mt-3 max-w-md font-medium">
              Manage your land records, view documents,<br />
              and predict land value easily with भूमि-सेवा.
            </p>
            <div className="flex gap-2 mt-4">
              <Link to="/dashboard/search" className="bg-navy-800 hover:bg-navy-900 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg transition flex items-center gap-2">
                <Search size={16} /> Search Records
              </Link>
              <Link to="/dashboard/predictions" className="bg-white hover:bg-gray-100 text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg transition flex items-center gap-2">
                <TrendingUp size={16} /> Predict Value
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - REAL DATA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          count={String(stats.totalRecords).padStart(2, "0")}
          label="My Land Records"
          sublabel="View all your land records"
          icon={FileText}
          gradientFrom="from-orange-400"
          gradientTo="to-orange-600"
          link="/dashboard/my-lands"
        />
        <StatCard
          count={String(stats.satbaraCount).padStart(2, "0")}
          label="7/12 Extracts"
          sublabel="View your 7/12 documents"
          icon={FileBadge}
          gradientFrom="from-navy-700"
          gradientTo="to-navy-900"
          link="/dashboard/satbara"
        />
        <StatCard
          count={String(stats.eightACount).padStart(2, "0")}
          label="8A Records"
          sublabel="View your 8A documents"
          icon={FileBadge}
          gradientFrom="from-yellow-500"
          gradientTo="to-orange-500"
          link="/dashboard/eight-a"
        />
        <StatCard
          count={String(stats.propertyCardCount).padStart(2, "0")}
          label="Property Cards"
          sublabel="Commercial & Residential"
          icon={Building2}
          gradientFrom="from-purple-500"
          gradientTo="to-purple-700"
          link="/dashboard/property-card"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border-t-4 border-orange-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center">
            <ChevronRight size={18} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-navy-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction icon={Search} label="Search Land" color="orange" link="/dashboard/search" />
          <QuickAction icon={TrendingUp} label="Value Prediction" color="navy" link="/dashboard/predictions" />
          <QuickAction icon={MapPin} label="GIS Map View" color="green" link="/dashboard/map" />
          <QuickAction icon={Download} label="Downloads" color="blue" link="/dashboard/downloads" />
        </div>
      </div>

      {/* Recent Records + Map + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Land Records - REAL */}
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-orange-500 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-orange-500" />
              <h3 className="font-bold text-navy-800">Recent Land Records</h3>
            </div>
            <Link to="/dashboard/my-lands" className="text-xs text-orange-500 font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="animate-spin mx-auto text-orange-500" size={24} />
              </div>
            ) : stats.recentRecords.length > 0 ? (
              stats.recentRecords.map((r) => (
                <div key={r.recordId} className="flex items-start gap-3 p-3 border-l-4 border-orange-400 bg-orange-50 rounded-lg hover:bg-orange-100 transition">
                  <div className="w-10 h-10 bg-white shadow-md rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy-800">Survey No. {r.surveyNo}</p>
                    <p className="text-xs text-gray-600 truncate">Village: {r.village}</p>
                    <p className="text-xs text-gray-500 truncate">Type: {r.landType}</p>
                  </div>
                  <Link to={`/document/${r.recordId}`} className="text-xs bg-navy-800 text-white px-3 py-1 rounded hover:bg-navy-900 transition font-semibold shadow-md">
                    View
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText size={40} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No records viewed yet</p>
                <Link to="/dashboard/search" className="text-xs text-orange-500 font-semibold hover:underline mt-2 inline-block">
                  Start Searching →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* GIS Map - REAL SATELLITE */}
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-navy-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-navy-800" />
              <h3 className="font-bold text-navy-800">Land Location (GIS Map)</h3>
            </div>
            <Link to="/dashboard/map" className="text-xs text-orange-500 font-semibold hover:underline flex items-center gap-1">
              Full Map <ChevronRight size={12} />
            </Link>
          </div>
          <div style={{ height: "220px", width: "100%" }} className="rounded-lg overflow-hidden border-2 border-orange-300">
            <MapContainer
              center={mapCenter}
              zoom={firstRecordWithCoords ? 16 : 12}
              style={{ height: "100%", width: "100%" }}
              key={firstRecordWithCoords?.recordId || "default"}
            >
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; Esri'
                maxZoom={19}
              />
              {firstRecordWithCoords && (
                <>
                  <Marker position={mapCenter}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold">Survey No. {firstRecordWithCoords.surveyNo}</p>
                        <p>{firstRecordWithCoords.village}</p>
                      </div>
                    </Popup>
                  </Marker>
                  <Polygon
                    positions={getPlotBoundary(firstRecordWithCoords)}
                    pathOptions={{
                      color: "#FBBF24",
                      fillColor: "#FDE047",
                      fillOpacity: 0.4,
                      weight: 3,
                    }}
                  />
                </>
              )}
            </MapContainer>
          </div>
          <p className="text-xs text-navy-800 font-semibold text-center mt-3 bg-orange-50 py-2 rounded">
            {firstRecordWithCoords
              ? `📍 Survey No. ${firstRecordWithCoords.surveyNo}, ${firstRecordWithCoords.village}`
              : "No location data - View a record first"}
          </p>
        </div>
      </div>

      {/* Bottom Stats - REAL COUNTS */}
      <div className="bg-gradient-to-r from-navy-800 via-navy-700 to-navy-800 rounded-xl shadow-xl p-6 border-b-4 border-orange-500">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <BottomStat label="Total Land Records" value={String(stats.totalRecords).padStart(2, "0")} />
          <BottomStat label="Total 7/12 Views" value={String(stats.satbaraCount).padStart(2, "0")} />
          <BottomStat label="Total 8A Views" value={String(stats.eightACount).padStart(2, "0")} />
          <BottomStat label="Total Predictions" value={String(stats.predictionCount).padStart(2, "0")} />
          <div className="flex items-center gap-2 border-l border-white/20 pl-6">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="text-white" size={20} />
            </div>
            <div>
              <p className="text-xs text-orange-200">Registered On</p>
              <p className="text-sm font-bold text-white">{registeredDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ count, label, sublabel, icon: Icon, gradientFrom, gradientTo, link }) {
  return (
    <Link to={link} className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl p-5 hover:shadow-2xl hover:scale-105 transition-all duration-300 group block shadow-lg`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <Icon size={24} className="text-white" />
        </div>
        <ChevronRight size={18} className="text-white/70 group-hover:text-white group-hover:translate-x-1 transition" />
      </div>
      <p className="text-4xl font-bold text-white drop-shadow-md">{count}</p>
      <p className="text-sm font-bold text-white mt-1">{label}</p>
      <p className="text-xs text-white/80">{sublabel}</p>
    </Link>
  );
}

function QuickAction({ icon: Icon, label, color, link }) {
  const colors = {
    orange: "bg-orange-400 text-white hover:bg-orange-500",
    navy: "bg-navy-800 text-white hover:bg-navy-900",
    green: "bg-green-500 text-white hover:bg-green-600",
    blue: "bg-blue-500 text-white hover:bg-blue-600",
  };
  return (
    <Link to={link} className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-500 hover:shadow-lg transition flex items-center gap-3 group bg-white">
      <div className={`w-11 h-11 rounded-lg ${colors[color]} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition`}>
        <Icon size={18} />
      </div>
      <span className="text-sm font-semibold text-navy-800 group-hover:text-orange-600 transition">{label}</span>
    </Link>
  );
}

function BottomStat({ label, value }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-xs text-orange-200 font-medium">{label}</p>
      <p className="text-3xl font-bold text-white mt-1 drop-shadow-md">{value}</p>
    </div>
  );
}

export default DashboardHome;