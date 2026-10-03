import { useState, useEffect } from "react";
import { contactAPI } from "../../services/api";
import {
  Search, Eye, Trash2, Mail, Phone, Clock, Check,
  CheckCircle, X, Send, AlertCircle, Filter
} from "lucide-react";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, replied: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMsg, setViewMsg] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    try {
      const res = await contactAPI.getAllAdmin();
      setMessages(res.data.messages || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleView = async (msg) => {
    setViewMsg(msg);
    setReplyText(msg.adminReply || "");
    if (msg.status === "Unread") {
      await contactAPI.markAsRead(msg.id);
      load();
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return showToast("❌ Reply cannot be empty");
    try {
      await contactAPI.reply(viewMsg.id, replyText);
      showToast("✅ Reply sent");
      const subject = `Re: ${viewMsg.subject}`;
      const body = `Dear ${viewMsg.name},\n\n${replyText}\n\n---\nOriginal Message:\n${viewMsg.message}\n\nRegards,\nBhoomi Seva Admin Team`;
      window.location.href = `mailto:${viewMsg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setViewMsg(null);
      load();
    } catch {
      showToast("❌ Failed");
    }
  };

  const handleResolve = async (id) => {
    await contactAPI.markResolved(id);
    showToast("✅ Resolved");
    setViewMsg(null);
    load();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete message from ${name}?`)) return;
    await contactAPI.delete(id);
    showToast("✅ Deleted");
    setViewMsg(null);
    load();
  };

  const filtered = messages.filter((m) => {
    if (filter !== "all" && m.status?.toLowerCase() !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q);
    }
    return true;
  });

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(date).toLocaleDateString("en-IN");
  };

  const statusColor = (s) => {
    const map = {
      Unread: "bg-red-100 text-red-700",
      Read: "bg-yellow-100 text-yellow-700",
      Replied: "bg-blue-100 text-blue-700",
      Resolved: "bg-green-100 text-green-700",
    };
    return map[s] || map.Unread;
  };

  if (loading) return <div className="text-center py-20"><div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-800 flex items-center gap-3">
          <Mail className="text-orange-500" /> Contact Messages
        </h1>
        <p className="text-gray-600 mt-1">Manage user inquiries and support requests</p>
      </div>

      {toast && <div className="fixed top-20 right-6 bg-navy-800 text-white px-6 py-3 rounded-lg shadow-2xl z-50 font-bold">{toast}</div>}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "orange", icon: Mail },
          { label: "Unread", value: stats.unread, color: "red", icon: AlertCircle },
          { label: "Replied", value: stats.replied, color: "blue", icon: Send },
          { label: "Resolved", value: stats.resolved, color: "green", icon: CheckCircle },
        ].map((s, i) => (
          <div key={i} className={`bg-white p-5 rounded-xl border-l-4 border-${s.color}-500 shadow-md`}>
            <div className="flex items-center gap-3">
              <div className={`bg-${s.color}-100 text-${s.color}-600 w-12 h-12 rounded-xl flex items-center justify-center`}>
                <s.icon size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-bold uppercase">{s.label}</p>
                <p className={`text-3xl font-bold text-${s.color}-600`}>{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border">
          <Search size={18} className="text-gray-500" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <div className="flex gap-2 items-center">
          <Filter size={16} className="text-gray-500" />
          {["all", "unread", "read", "replied", "resolved"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                filter === f ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Mail size={60} className="text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-navy-800 text-xl">No messages found</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div key={msg.id} className={`bg-white p-5 rounded-xl border-l-4 flex gap-4 hover:shadow-lg transition ${
              msg.status === "Unread" ? "border-red-500" : msg.status === "Replied" ? "border-blue-500" : msg.status === "Resolved" ? "border-green-500" : "border-yellow-500"
            }`}>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                {msg.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-navy-800 flex items-center gap-2">
                      {msg.name}
                      {msg.status === "Unread" && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">NEW</span>}
                    </h4>
                    <div className="text-xs text-gray-600 flex gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1"><Mail size={10} /> {msg.email}</span>
                      {msg.phone && <span className="flex items-center gap-1"><Phone size={10} /> {msg.phone}</span>}
                      <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(msg.createdAt)}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(msg.status)}`}>● {msg.status}</span>
                </div>
                <p className="text-sm font-semibold text-navy-800 mb-1">📌 {msg.subject}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{msg.message}</p>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => handleView(msg)} className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-600 flex items-center gap-1">
                    <Eye size={12} /> View & Reply
                  </button>
                  {msg.status !== "Resolved" && (
                    <button onClick={() => handleResolve(msg.id)} className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 flex items-center gap-1">
                      <Check size={12} /> Resolve
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg.id, msg.name)} className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 flex items-center gap-1">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewMsg && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setViewMsg(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-navy-800 text-lg">Message from {viewMsg.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{timeAgo(viewMsg.createdAt)}</p>
              </div>
              <button onClick={() => setViewMsg(null)} className="w-9 h-9 bg-gray-100 rounded-lg"><X /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex gap-3 items-center bg-gray-50 p-4 rounded-lg">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">{viewMsg.name?.charAt(0)}</div>
                <div className="flex-1">
                  <p className="font-bold text-navy-800">{viewMsg.name}</p>
                  <p className="text-xs text-gray-600"><Mail size={10} className="inline mr-1" />{viewMsg.email}</p>
                  {viewMsg.phone && <p className="text-xs text-gray-600"><Phone size={10} className="inline mr-1" />{viewMsg.phone}</p>}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(viewMsg.status)}`}>● {viewMsg.status}</span>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Subject:</label>
                <p className="bg-gray-50 p-3 rounded-lg font-semibold mt-1">{viewMsg.subject}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Message:</label>
                <p className="bg-gray-50 p-4 rounded-lg mt-1 whitespace-pre-wrap text-sm">{viewMsg.message}</p>
              </div>
              {viewMsg.adminReply && (
                <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
                  <label className="text-xs font-bold text-green-700 uppercase">Your Previous Reply:</label>
                  <p className="mt-2 text-sm text-green-800 whitespace-pre-wrap">{viewMsg.adminReply}</p>
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">📝 {viewMsg.adminReply ? "Update Reply:" : "Type your reply:"}</label>
                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={5}
                  placeholder="Write your reply here..."
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"></textarea>
                <p className="text-xs text-gray-500 mt-2">💡 Reply will open email client to send to {viewMsg.email}</p>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex gap-3">
              <button onClick={() => handleDelete(viewMsg.id, viewMsg.name)} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-200 flex items-center gap-2">
                <Trash2 size={16} /> Delete
              </button>
              {viewMsg.status !== "Resolved" && (
                <button onClick={() => handleResolve(viewMsg.id)} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 flex items-center gap-2">
                  <CheckCircle size={16} /> Resolve
                </button>
              )}
              <button onClick={handleReply} className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600 flex items-center justify-center gap-2">
                <Send size={16} /> Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMessages;