import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Database, FileText, FileBadge, Users, Building2,
  MapPin, Loader2, TrendingUp, Activity
} from "lucide-react";
import { adminAPI } from "../../services/api";

function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalLandRecords: 0,
    totalSatbara: 0,
    totalEightA: 0,
    totalPropertyCards: 0,
    totalUsers: 0,
    totalVillages: 0,
  });
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, recordsRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllLandRecords(),
      ]);
      setStats(statsRes.data);
      setRecentRecords(recordsRes.data.slice(0, 7));
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl shadow-xl p-6 border-b-4 border-orange-600">
        <h1 className="text-2xl font-bold text-white">Welcome back, Admin!</h1>
        <p className="text-white/90 text-sm mt-1">Here's what's happening in your system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={Database}
          label="Total Land Records"
          value={stats.totalLandRecords}
          color="bg-blue-500"
          link="/admin/land-records"
        />
        <StatCard
          icon={FileText}
          label="7/12 Extracts"
          value={stats.totalSatbara}
          color="bg-green-500"
          link="/admin/satbara"
        />
        <StatCard
          icon={FileBadge}
          label="8A Records"
          value={stats.totalEightA}
          color="bg-orange-500"
          link="/admin/eight-a"
        />
        <StatCard
          icon={Building2}
          label="Property Cards"
          value={stats.totalPropertyCards}
          color="bg-purple-500"
          link="/admin/property-cards"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          color="bg-navy-800"
          link="/admin/users"
        />
      </div>

      {/* Recent Land Records Table */}
      <div className="bg-white rounded-xl shadow-lg border-t-4 border-orange-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-navy-800">Recent Land Records</h3>
            <p className="text-sm text-gray-500">Latest entries in the database</p>
          </div>
          <Link
            to="/admin/land-records"
            className="text-sm text-orange-500 font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-navy-800">SR. NO.</th>
                <th className="px-4 py-3 font-semibold text-navy-800">SURVEY NO.</th>
                <th className="px-4 py-3 font-semibold text-navy-800">VILLAGE</th>
                <th className="px-4 py-3 font-semibold text-navy-800">TYPE</th>
                <th className="px-4 py-3 font-semibold text-navy-800">AREA (SQFT)</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((record, idx) => (
                <tr key={record.recordId} className="border-b hover:bg-orange-50">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold text-navy-800">{record.surveyNo}</td>
                  <td className="px-4 py-3">{record.village}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {record.landType}
                    </span>
                  </td>
                  <td className="px-4 py-3">{record.landAreaSqft?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <InfoCard icon={Activity} label="Backend Status" value="Running :8080" color="text-blue-600 bg-blue-100" />
        <InfoCard icon={TrendingUp} label="ML API" value="Running :5000" color="text-green-600 bg-green-100" />
        <InfoCard icon={Database} label="Database" value="MySQL Connected" color="text-purple-600 bg-purple-100" />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, link }) {
  return (
    <Link
      to={link}
      className="bg-white rounded-xl shadow-lg p-5 hover:shadow-2xl hover:-translate-y-1 transition-all border-l-4 border-orange-500"
    >
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className="text-white" size={24} />
      </div>
      <p className="text-3xl font-bold text-navy-800">{String(value).padStart(2, "0")}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </Link>
  );
}

function InfoCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold text-navy-800">{value}</p>
      </div>
    </div>
  );
}

export default AdminDashboardHome;