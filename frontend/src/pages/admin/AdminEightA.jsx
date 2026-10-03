import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, Search, X, Loader2, FileBadge } from "lucide-react";
import { adminAPI } from "../../services/api";
import { Pagination } from "./AdminUsers";

function AdminEightA() {
  const [records, setRecords] = useState([]);
  const [landRecords, setLandRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterVillage, setFilterVillage] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({ recordId: "", ownerName: "", ownerAddress: "" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eightARes, landRes] = await Promise.all([
        adminAPI.getAllEightA(),
        adminAPI.getAllLandRecords(),
      ]);
      setRecords(eightARes.data);
      setLandRecords(landRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.generateEightA(formData.recordId, formData);
      alert("✅ 8A Record generated!");
      setShowModal(false);
      setFormData({ recordId: "", ownerName: "", ownerAddress: "" });
      loadData();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this 8A record?")) return;
    try {
      await adminAPI.deleteEightA(id);
      alert("✅ Deleted!");
      loadData();
    } catch (err) { alert("❌ " + err.message); }
  };

  const villages = [...new Set(records.map((r) => r.village).filter(Boolean))];

  const filteredRecords = records.filter((r) => {
    const matchSearch =
      r.surveyNo?.toLowerCase().includes(search.toLowerCase()) ||
      r.village?.toLowerCase().includes(search.toLowerCase()) ||
      r.owner1Name?.toLowerCase().includes(search.toLowerCase());
    const matchVillage = filterVillage === "ALL" || r.village === filterVillage;
    const matchStatus = filterStatus === "ALL" || r.verificationStatus === filterStatus;
    return matchSearch && matchVillage && matchStatus;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">8A Record</h1>
            <p className="text-sm text-gray-500">Home / 8A Record</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-md">
            <Plus size={18} /> Generate 8A
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by Owner, Survey No..." value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <select value={filterVillage} onChange={(e) => { setFilterVillage(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
            <option value="ALL">All Villages</option>
            {villages.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
            <option value="ALL">All Status</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" size={40} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">SR. NO.</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">OWNER NAME</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">VILLAGE</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">SURVEY NO.</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">STATUS</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">DATE</th>
                  <th className="px-4 py-3 text-center font-semibold text-navy-800">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((r, idx) => (
                  <tr key={r.eightAId} className="border-b hover:bg-orange-50 transition">
                    <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-navy-800">{r.owner1Name || "N/A"}</td>
                    <td className="px-4 py-3">{r.village}</td>
                    <td className="px-4 py-3">{r.surveyNo}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{r.verificationStatus}</span>
                    </td>
                    <td className="px-4 py-3">{r.generatedDate ? new Date(r.generatedDate).toLocaleDateString("en-IN") : "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => window.open(`/document/${r.recordId}`, "_blank")}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded" title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDelete(r.eightAId)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginatedRecords.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <FileBadge size={40} className="mx-auto mb-2 text-gray-300" />
                No 8A records found
              </div>
            )}
          </div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredRecords.length} onPageChange={setCurrentPage} />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="bg-orange-500 text-white p-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold">Generate 8A Record</h2>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Land Record *</label>
                <select value={formData.recordId} onChange={(e) => setFormData({ ...formData, recordId: e.target.value })} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="">-- Select --</option>
                  {landRecords.map((land) => (
                    <option key={land.recordId} value={land.recordId}>
                      Survey {land.surveyNo} - {land.village} ({land.landType})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Owner Name *</label>
                <input type="text" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Owner Address</label>
                <textarea value={formData.ownerAddress} onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })} rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEightA;