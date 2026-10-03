import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, Search, X, Loader2 } from "lucide-react";
import { adminAPI } from "../../services/api";
import { Pagination } from "./AdminUsers";

function AdminLandRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterVillage, setFilterVillage] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    surveyNo: "", village: "", taluka: "", district: "Amravati",
    landType: "Agricultural", landAreaSqft: "", landCategory: "Rural",
    roadConnectivity: "Good", readyReckonerRateRsSqft: "", latitude: "",
    longitude: "", distanceHighwayKm: "", distanceCityKm: "",
    distanceSchoolKm: "", distanceHospital: "", distanceMarket: "",
    currentMarketPrice: "", governmentRate: "",
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllLandRecords();
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createLandRecord(formData);
      alert("✅ Land Record added successfully!");
      setShowModal(false);
      resetForm();
      loadRecords();
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await adminAPI.deleteLandRecord(id);
      alert("✅ Deleted successfully!");
      loadRecords();
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      surveyNo: "", village: "", taluka: "", district: "Amravati",
      landType: "Agricultural", landAreaSqft: "", landCategory: "Rural",
      roadConnectivity: "Good", readyReckonerRateRsSqft: "", latitude: "",
      longitude: "", distanceHighwayKm: "", distanceCityKm: "",
      distanceSchoolKm: "", distanceHospital: "", distanceMarket: "",
      currentMarketPrice: "", governmentRate: "",
    });
  };

  const villages = [...new Set(records.map((r) => r.village).filter(Boolean))];
  const types = [...new Set(records.map((r) => r.landType).filter(Boolean))];

  const filteredRecords = records.filter((r) => {
    const matchSearch =
      r.surveyNo?.toLowerCase().includes(search.toLowerCase()) ||
      r.village?.toLowerCase().includes(search.toLowerCase());
    const matchVillage = filterVillage === "ALL" || r.village === filterVillage;
    const matchType = filterType === "ALL" || r.landType === filterType;
    return matchSearch && matchVillage && matchType;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">Land Records</h1>
            <p className="text-sm text-gray-500">Home / Land Records</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-md"
          >
            <Plus size={18} /> Add New Record
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Survey No. or Village..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <select
            value={filterVillage}
            onChange={(e) => { setFilterVillage(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="ALL">All Villages</option>
            {villages.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>

          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="ALL">All Types</option>
            {types.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-orange-500" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">SR. NO.</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">SURVEY NO.</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">VILLAGE</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">TALUKA</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">TYPE</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">AREA</th>
                  <th className="px-4 py-3 text-center font-semibold text-navy-800">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((r, idx) => (
                  <tr key={r.recordId} className="border-b hover:bg-orange-50 transition">
                    <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-navy-800">{r.surveyNo}</td>
                    <td className="px-4 py-3">{r.village}</td>
                    <td className="px-4 py-3">{r.taluka}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{r.landType}</span>
                    </td>
                    <td className="px-4 py-3">{r.landAreaSqft?.toLocaleString()} sqft</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDelete(r.recordId)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginatedRecords.length === 0 && (
              <div className="text-center py-12 text-gray-400">No records found</div>
            )}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredRecords.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-orange-500 text-white p-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold">Add New Land Record</h2>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Survey No *" name="surveyNo" value={formData.surveyNo} onChange={handleChange} required />
                <InputField label="Village *" name="village" value={formData.village} onChange={handleChange} required />
                <InputField label="Taluka *" name="taluka" value={formData.taluka} onChange={handleChange} required />
                <InputField label="District *" name="district" value={formData.district} onChange={handleChange} required />
                <SelectField label="Land Type *" name="landType" value={formData.landType} onChange={handleChange}
                  options={["Agricultural", "Residential", "Commercial", "Industrial"]} />
                <SelectField label="Land Category" name="landCategory" value={formData.landCategory} onChange={handleChange}
                  options={["Rural", "Urban", "Semi-Urban"]} />
                <InputField label="Land Area (Sqft) *" name="landAreaSqft" value={formData.landAreaSqft} onChange={handleChange} type="number" required />
                <SelectField label="Road Connectivity" name="roadConnectivity" value={formData.roadConnectivity} onChange={handleChange}
                  options={["Excellent", "Good", "Average", "Poor"]} />
                <InputField label="Ready Reckoner Rate (₹/sqft)" name="readyReckonerRateRsSqft" value={formData.readyReckonerRateRsSqft} onChange={handleChange} type="number" />
                <InputField label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} type="number" step="0.000001" />
                <InputField label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} type="number" step="0.000001" />
                <InputField label="Distance Highway (km)" name="distanceHighwayKm" value={formData.distanceHighwayKm} onChange={handleChange} type="number" step="0.01" />
                <InputField label="Distance City (km)" name="distanceCityKm" value={formData.distanceCityKm} onChange={handleChange} type="number" step="0.01" />
                <InputField label="Distance School (km)" name="distanceSchoolKm" value={formData.distanceSchoolKm} onChange={handleChange} type="number" step="0.01" />
                <InputField label="Distance Hospital (km)" name="distanceHospital" value={formData.distanceHospital} onChange={handleChange} type="number" step="0.01" />
                <InputField label="Distance Market (km)" name="distanceMarket" value={formData.distanceMarket} onChange={handleChange} type="number" step="0.01" />
                <InputField label="Current Market Price (₹)" name="currentMarketPrice" value={formData.currentMarketPrice} onChange={handleChange} type="number" />
                <InputField label="Government Rate (₹)" name="governmentRate" value={formData.governmentRate} onChange={handleChange} type="number" />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">Add Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "text", required, step }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} step={step}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <select name={name} value={value} onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        {options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
      </select>
    </div>
  );
}

export default AdminLandRecords;