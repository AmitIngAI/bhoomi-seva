import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificationAPI, landRecordsAPI } from "../services/api";
import {
  Bell, Check, Trash2, CheckCircle, Plus, Edit, XCircle,
  Info, X, ArrowRight, Clock, Eye, Tag, AlertCircle
} from "lucide-react";

function DashboardNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [recordDetails, setRecordDetails] = useState(null);
  const [loadingRecord, setLoadingRecord] = useState(false);

  useEffect(() => {
    if (user?.id) load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const load = async () => {
    try {
      const res = await notificationAPI.getAll(user.id);
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const extractRecordId = (msg) => {
    if (!msg) return null;
    const match = msg.match(/\[RECORD_ID:(\d+)\]/);
    return match ? parseInt(match[1]) : null;
  };

  const cleanMessage = (msg) => msg?.replace(/\[RECORD_ID:\d+\]/g, "").trim() || "";

  const handleClick = async (notif) => {
    setSelectedNotif(notif);
    setRecordDetails(null);
    if (!notif.isRead) {
      await notificationAPI.markAsRead(notif.id);
      load();
    }
    const recordId = extractRecordId(notif.message);
    if (recordId && notif.type !== "RECORD_DELETED") {
      setLoadingRecord(true);
      try {
        const res = await landRecordsAPI.getById(recordId);
        setRecordDetails(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRecord(false);
      }
    }
  };

  const handleMarkAllRead = async () => {
    await notificationAPI.markAllAsRead(user.id);
    load();
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Delete this notification?")) return;
    await notificationAPI.delete(id);
    if (selectedNotif?.id === id) setSelectedNotif(null);
    load();
  };

  const handleViewRecord = (id) => {
    setSelectedNotif(null);
    navigate(`/document/${id}`);
  };

  const getIcon = (type) => {
    const map = {
      RECORD_ADDED: { icon: <Plus />, bg: "bg-green-100", color: "text-green-600", label: "New Record" },
      RECORD_UPDATED: { icon: <Edit />, bg: "bg-blue-100", color: "text-blue-600", label: "Updated" },
      RECORD_DELETED: { icon: <XCircle />, bg: "bg-red-100", color: "text-red-600", label: "Removed" },
      INFO: { icon: <Info />, bg: "bg-gray-100", color: "text-gray-600", label: "Info" },
    };
    return map[type] || map.INFO;
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString("en-IN");
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) return <div className="text-center py-20"><div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy-800 flex items-center gap-3">
            <Bell className="text-orange-500" /> Notifications
          </h1>
          <p className="text-gray-600 mt-1">{unreadCount} unread of {notifications.length} total</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-bold hover:bg-orange-200 flex items-center gap-2">
            <CheckCircle size={16} /> Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["all", "unread", "read"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-lg font-bold text-sm ${
              filter === f ? "bg-orange-500 text-white" : "bg-white text-gray-600 border border-gray-300"
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === "unread" ? unreadCount : f === "read" ? notifications.length - unreadCount : notifications.length})
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Bell size={60} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-navy-800">No notifications</h3>
          <p className="text-gray-500 mt-2">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const iconData = getIcon(n.type);
            return (
              <div key={n.id} onClick={() => handleClick(n)}
                className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                  n.isRead ? "bg-white border-gray-200" : "bg-orange-50 border-orange-300"
                }`}>
                <div className={`${iconData.bg} ${iconData.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {iconData.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase">{iconData.label}</span>
                      <h4 className="font-bold text-navy-800 mt-1 flex items-center gap-2">
                        {n.title}
                        {!n.isRead && <span className="w-2 h-2 bg-orange-500 rounded-full"></span>}
                      </h4>
                    </div>
                    <span className="text-xs text-gray-500 font-semibold">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{cleanMessage(n.message)}</p>
                  <p className="text-xs text-orange-500 font-bold mt-2 flex items-center gap-1"><Eye size={12} /> Click for full details</p>
                </div>
                <button onClick={(e) => handleDelete(n.id, e)} className="text-red-500 hover:bg-red-50 w-8 h-8 rounded flex items-center justify-center flex-shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedNotif(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className={`p-6 flex justify-between items-center ${getIcon(selectedNotif.type).bg}`}>
              <div className="flex gap-4 items-center">
                <div className={`w-14 h-14 ${getIcon(selectedNotif.type).color} bg-white rounded-xl flex items-center justify-center`}>
                  {getIcon(selectedNotif.type).icon}
                </div>
                <div>
                  <span className={`text-xs font-bold uppercase ${getIcon(selectedNotif.type).color}`}>{getIcon(selectedNotif.type).label}</span>
                  <h2 className="text-xl font-bold text-navy-800">{selectedNotif.title}</h2>
                </div>
              </div>
              <button onClick={() => setSelectedNotif(null)} className="w-9 h-9 bg-white rounded-lg hover:bg-gray-100 flex items-center justify-center"><X /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                <Clock className="text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500 font-bold">Received on</p>
                  <p className="text-sm font-bold">{new Date(selectedNotif.createdAt).toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">📝 What Changed / Details</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {cleanMessage(selectedNotif.message).split("\n").map((line, i) => (
                    line.trim() && <p key={i} className="text-sm text-gray-800 leading-relaxed">{line.trim()}</p>
                  ))}
                </div>
              </div>

              {loadingRecord && <div className="text-center py-4"><div className="animate-spin w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full mx-auto"></div></div>}

              {recordDetails && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">🎯 Related Land Record</p>
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-navy-800">Survey No: {recordDetails.surveyNo}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1"><Tag size={12} /> {recordDetails.village}, {recordDetails.taluka}</p>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">● Active</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-500 font-bold uppercase">Type</p>
                        <p className="font-bold text-navy-800 text-sm">{recordDetails.landType}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-500 font-bold uppercase">Area</p>
                        <p className="font-bold text-navy-800 text-sm">{recordDetails.landAreaSqft} sqft</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-500 font-bold uppercase">Price</p>
                        <p className="font-bold text-navy-800 text-sm">₹{Number(recordDetails.currentMarketPrice).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <button onClick={() => handleViewRecord(recordDetails.recordId)} className="w-full bg-navy-800 hover:bg-navy-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                      <Eye /> View Full Details <ArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {selectedNotif.type === "RECORD_DELETED" && (
                <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg flex gap-3">
                  <AlertCircle className="text-red-500 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-red-800">Land Record Removed</p>
                    <p className="text-sm text-red-700 mt-1">This land record has been permanently removed from the portal.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 flex gap-3">
              <button onClick={(e) => handleDelete(selectedNotif.id, e)} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-200 flex items-center gap-2">
                <Trash2 size={16} /> Delete
              </button>
              {recordDetails ? (
                <button onClick={() => handleViewRecord(recordDetails.recordId)} className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600 flex items-center justify-center gap-2">
                  <Eye /> Go to Record <ArrowRight />
                </button>
              ) : (
                <button onClick={() => setSelectedNotif(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold">Close</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardNotifications;