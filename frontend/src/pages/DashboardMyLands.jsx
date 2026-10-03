import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Eye, MapPin, Loader2, Info, FileBadge } from "lucide-react";
import { userActivityAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function DashboardMyLands({ filterType, documentType }) {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyLands();
  }, [user, filterType]);

  const loadMyLands = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await userActivityAPI.getMyLands(user.id);
      let data = res.data || [];

      // Filter based on document type
      if (filterType === "agricultural") {
        data = data.filter(r => r.landType === "Agricultural Plot");
      } else if (filterType === "property") {
        data = data.filter(r => r.landType !== "Agricultural Plot");
      }

      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  const pageConfig = {
    "7/12": {
      title: "7/12 Extract Records",
      subtitle: "Your Agricultural 7/12 (सात/बारा) records",
      icon: FileBadge,
      color: "green",
      emptyMsg: "No 7/12 records viewed yet. Search agricultural records to view 7/12 extracts."
    },
    "8A": {
      title: "8A Record",
      subtitle: "Your Agricultural 8A (आठ अ) records",
      icon: FileBadge,
      color: "blue",
      emptyMsg: "No 8A records viewed yet. Search agricultural records to view 8A extracts."
    },
    "Property Card": {
      title: "Property Card Records",
      subtitle: "Your Commercial & Residential Property Card records",
      icon: FileBadge,
      color: "purple",
      emptyMsg: "No property cards viewed yet. Search Commercial/Residential records."
    },
    "default": {
      title: "My Land Records",
      subtitle: "Your recently viewed land records (Max 5)",
      icon: FileText,
      color: "orange",
      emptyMsg: "No records yet. Search for land records to view them."
    }
  };

  const config = pageConfig[documentType] || pageConfig["default"];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-orange-500 hover:underline">Dashboard</Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700 font-semibold">{config.title}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">{config.title}</h1>
          <p className="text-gray-600 text-sm">{config.subtitle}</p>
        </div>
        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-semibold text-sm">
          {records.length} / 5 records
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg flex items-start gap-3">
        <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm">
          <p className="font-semibold text-blue-900">Auto-Cleanup: Latest 5 Records</p>
          <p className="text-blue-700 mt-1">
            Only your 5 most recently viewed records are saved. Older ones auto-delete.
          </p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-16 text-center">
          <Icon className="mx-auto text-gray-300" size={64} />
          <p className="text-gray-600 mt-4 text-lg font-semibold">No records yet</p>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            {config.emptyMsg}
          </p>
          <Link
            to="/dashboard/search"
            className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Search Records
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((r, idx) => (
            <div key={r.recordId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 border-l-4 border-orange-400">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-navy-800 text-lg">Survey No. {r.surveyNo}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        r.landType?.includes("Agricultural") ? "bg-green-100 text-green-700" :
                        r.landType?.includes("Commercial") ? "bg-orange-100 text-orange-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>{r.landType}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-orange-500" /> {r.village}, {r.taluka}
                      </span>
                      <span>Area: <span className="font-semibold text-navy-800">{r.landAreaSqft?.toLocaleString()} sqft</span></span>
                      <span>Price: <span className="font-semibold text-orange-500">₹{(r.currentMarketPrice/100000).toFixed(2)}L</span></span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Owner: {r.ownerName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/document/${r.recordId}${documentType ? `?doc=${documentType}` : ''}`}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-sm font-semibold shadow-md transition"
                  >
                    <Eye size={14} /> View {documentType || "Document"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardMyLands;