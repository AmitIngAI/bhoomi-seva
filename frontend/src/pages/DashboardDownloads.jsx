import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download, FileText, Eye, Loader2, MapPin, Calendar } from "lucide-react";
import { userActivityAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function DashboardDownloads() {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDownloads();
  }, [user]);

  const loadDownloads = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await userActivityAPI.getDownloads(user.id);
      setDownloads(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDocIcon = (type) => {
    if (type.includes("7/12") || type.includes("Satbara")) return "📜";
    if (type.includes("8A")) return "📋";
    if (type.includes("Property")) return "🏢";
    return "📄";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-orange-500 hover:underline">Dashboard</Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700 font-semibold">Downloaded Documents</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Downloaded Documents</h1>
          <p className="text-gray-600 text-sm">All documents you have downloaded</p>
        </div>
        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-semibold text-sm">
          Total: {downloads.length}
        </div>
      </div>

      {downloads.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-16 text-center">
          <Download className="mx-auto text-gray-300" size={64} />
          <p className="text-gray-600 mt-4 text-lg font-semibold">No downloads yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Download documents from land record view page.
          </p>
          <Link
            to="/dashboard/search"
            className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Search Records
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-orange-500">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-navy-800 to-navy-900 text-white text-sm">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Document Type</th>
                <th className="px-6 py-3 text-left">Survey No.</th>
                <th className="px-6 py-3 text-left">Village</th>
                <th className="px-6 py-3 text-left">Download Date</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((d, idx) => (
                <tr key={d.downloadId} className="border-b hover:bg-orange-50 transition">
                  <td className="px-6 py-4 text-gray-500 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getDocIcon(d.documentType)}</span>
                      <span className="font-semibold text-navy-800">{d.documentType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-navy-800">{d.surveyNo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-700">
                      <MapPin size={12} className="text-orange-500" />
                      {d.village}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(d.downloadedAt).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/document/${d.recordId}`}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-xs font-semibold shadow-md transition"
                    >
                      <Eye size={12} /> View Again
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardDownloads;