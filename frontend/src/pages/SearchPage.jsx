import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { landRecordsAPI, predictionAPI } from "../services/api";
import {
  Search, MapPin, Loader2,
  ChevronLeft, ChevronRight, Filter, X, TrendingUp
} from "lucide-react";

function SearchPage() {
  const navigate = useNavigate();
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [villages, setVillages] = useState([]);
  const [landTypes, setLandTypes] = useState([]);
  const [predictions, setPredictions] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedVillage, selectedType, allRecords]);

  useEffect(() => {
    if (filteredRecords.length > 0) {
      loadPredictionsForCurrentPage();
    }
  }, [currentPage, filteredRecords]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [recordsRes, vRes, lRes] = await Promise.all([
        landRecordsAPI.getAll(),
        landRecordsAPI.getVillages(),
        landRecordsAPI.getLandTypes(),
      ]);
      setAllRecords(recordsRes.data);
      setFilteredRecords(recordsRes.data);
      setVillages(vRes.data);
      setLandTypes(lRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPredictionsForCurrentPage = async () => {
    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;
    const pageRecords = filteredRecords.slice(indexOfFirst, indexOfLast);

    const recordsNeedingPrediction = pageRecords.filter(
      (r) => predictions[r.recordId] === undefined
    );

    if (recordsNeedingPrediction.length === 0) return;

    const newPredictions = {};

    await Promise.all(
      recordsNeedingPrediction.map(async (record) => {
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

          if (res.data?.success && res.data?.prediction) {
            newPredictions[record.recordId] =
              res.data.prediction.predicted_price ||
              res.data.prediction.predicted_price_formatted;
          } else {
            newPredictions[record.recordId] = null;
          }
        } catch (err) {
          console.error("Prediction failed for record", record.recordId, err);
          newPredictions[record.recordId] = null;
        }
      })
    );
    setPredictions((prev) => ({ ...prev, ...newPredictions }));
  };

  const applyFilters = () => {
    let filtered = [...allRecords];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.surveyNo?.toLowerCase().includes(q) ||
          r.village?.toLowerCase().includes(q) ||
          r.ownerName?.toLowerCase().includes(q)
      );
    }

    if (selectedVillage !== "all") {
      filtered = filtered.filter((r) => r.village === selectedVillage);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((r) => r.landType === selectedType);
    }

    setFilteredRecords(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedVillage("all");
    setSelectedType("all");
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") return "N/A";
    if (typeof price === "string" && price.includes("₹")) return price;
    const num = parseFloat(price);
    if (isNaN(num) || num === 0) return "N/A";
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString()}`;
  };

  const landTypeClass = (type) =>
    type?.includes("Agricultural")
      ? "bg-green-100 text-green-800"
      : type?.includes("Commercial")
      ? "bg-orange-100 text-orange-800"
      : "bg-blue-100 text-blue-800";

  const roadClass = (road) =>
    road === "Excellent"
      ? "bg-green-100 text-green-800"
      : road === "Good"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const renderPrediction = (record, textClass = "text-green-700") => {
    const p = predictions[record.recordId];
    if (p === undefined) {
      return <Loader2 className="animate-spin inline text-orange-500" size={14} />;
    }
    return <span className={textClass}>{formatPrice(p)}</span>;
  };

  return (
    <div className="w-full min-w-0 bg-gray-50 py-4 sm:py-8">
      <div className="w-full max-w-[1600px] mx-auto px-1 sm:px-4 lg:px-8">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-navy-800 to-navy-900 rounded-full mb-3 sm:mb-4 shadow-xl">
            <Search className="text-white" size={28} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-navy-800 mb-2">Search Land Records</h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Total Records: <span className="font-bold text-orange-500">{allRecords.length}</span>
            {filteredRecords.length !== allRecords.length && (
              <> | Showing: <span className="font-bold text-orange-500">{filteredRecords.length}</span></>
            )}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">💡 Click any record to view full document details</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="text-orange-500" size={20} />
              <h3 className="font-bold text-navy-800 text-lg">Filters</h3>
            </div>
            {(searchQuery || selectedVillage !== "all" || selectedType !== "all") && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <X size={14} /> Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by Survey No / Village / Owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
              />
            </div>

            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base"
            >
              <option value="all">All Villages ({villages.length})</option>
              {villages.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base"
            >
              <option value="all">All Land Types ({landTypes.length})</option>
              {landTypes.map((tp) => (
                <option key={tp} value={tp}>{tp}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 sm:p-20 text-center">
            <Loader2 className="animate-spin mx-auto text-orange-500" size={48} />
            <p className="text-gray-600 mt-4 text-lg">Loading records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 sm:p-20 text-center">
            <p className="text-gray-600 mt-4 text-lg font-semibold">No records found</p>
            <button
              onClick={clearFilters}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE  */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-lg mb-4 w-full max-w-full">
              <div className="overflow-x-auto w-full max-w-full rounded-2xl">
                <table className="min-w-[1800px] w-full text-xs">
                  <thead className="bg-gradient-to-r from-navy-800 to-navy-900 text-white">
                    <tr>
                      <th className="px-3 py-3 text-left font-semibold">#</th>
                      <th className="px-3 py-3 text-left font-semibold">Taluka</th>
                      <th className="px-3 py-3 text-left font-semibold">District</th>
                      <th className="px-3 py-3 text-left font-semibold">Land Type</th>
                      <th className="px-3 py-3 text-left font-semibold">Category</th>
                      <th className="px-3 py-3 text-right font-semibold">RR Rate<br />(₹/sqft)</th>
                      <th className="px-3 py-3 text-left font-semibold">Coordinates</th>
                      <th className="px-3 py-3 text-right font-semibold">Area<br />(sqft)</th>
                      <th className="px-3 py-3 text-left font-semibold">Road</th>
                      <th className="px-3 py-3 text-right font-semibold">Highway<br />(km)</th>
                      <th className="px-3 py-3 text-right font-semibold">City<br />(km)</th>
                      <th className="px-3 py-3 text-right font-semibold">School<br />(km)</th>
                      <th className="px-3 py-3 text-right font-semibold">Hospital<br />(km)</th>
                      <th className="px-3 py-3 text-right font-semibold">Market<br />(km)</th>
                      <th className="px-3 py-3 text-right font-semibold">Historical<br />Price</th>
                      <th className="px-3 py-3 text-right font-semibold">Govt<br />Rate</th>
                      <th className="px-3 py-3 text-right font-semibold">Sale<br />Price</th>
                      <th className="px-3 py-3 text-right font-semibold">Market<br />Price</th>
                      <th className="px-3 py-3 text-right font-semibold bg-orange-600">
                        <div className="flex items-center justify-end gap-1">
                          <TrendingUp size={12} />
                          AI Predicted
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left font-semibold">Survey No</th>
                      <th className="px-3 py-3 text-left font-semibold">Village</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.map((record, idx) => (
                      <tr
                        key={record.recordId}
                        onClick={() => navigate(`/document/${record.recordId}`)}
                        className="border-b hover:bg-orange-50 transition cursor-pointer"
                      >
                        <td className="px-3 py-3 text-gray-500 font-medium">
                          {indexOfFirstRecord + idx + 1}
                        </td>
                        <td className="px-3 py-3 text-gray-700">{record.taluka || "N/A"}</td>
                        <td className="px-3 py-3 text-gray-700">{record.district || "N/A"}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${landTypeClass(record.landType)}`}
                          >
                            {record.landType}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-700">{record.landCategory || "N/A"}</td>
                        <td className="px-3 py-3 text-right text-gray-700">
                          ₹{record.readyReckonerRateRsSqft?.toLocaleString() || "N/A"}
                        </td>
                        <td className="px-3 py-3 text-gray-600 text-[10px]">
                          {record.latitude?.toFixed(4)}°N,<br />
                          {record.longitude?.toFixed(4)}°E
                        </td>
                        <td className="px-3 py-3 text-right text-gray-700">
                          {record.landAreaSqft?.toLocaleString()}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap ${roadClass(record.roadConnectivity)}`}
                          >
                            {record.roadConnectivity}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right text-gray-700">{record.distanceHighwayKm}</td>
                        <td className="px-3 py-3 text-right text-gray-700">{record.distanceCityKm}</td>
                        <td className="px-3 py-3 text-right text-gray-700">{record.distanceSchoolKm}</td>
                        <td className="px-3 py-3 text-right text-gray-700">{record.distanceHospitalKm}</td>
                        <td className="px-3 py-3 text-right text-gray-700">{record.distanceMarketKm}</td>
                        <td className="px-3 py-3 text-right text-gray-700">
                          {formatPrice(record.historicalPrice)}
                        </td>
                        <td className="px-3 py-3 text-right text-gray-700">
                          {formatPrice(record.governmentRate)}
                        </td>
                        <td className="px-3 py-3 text-right text-gray-700">
                          {formatPrice(record.salePrice)}
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-orange-500">
                          {formatPrice(record.currentMarketPrice)}
                        </td>
                        <td className="px-3 py-3 text-right font-bold bg-orange-50">
                          {renderPrediction(record)}
                        </td>
                        <td className="px-3 py-3 font-bold text-navy-800">
                          {record.surveyNo}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                            <MapPin size={12} className="text-orange-500" />
                            {record.village}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE / TABLET CARDS (below lg) */}
            <div className="lg:hidden space-y-3 mb-4">
              {currentRecords.map((record, idx) => (
                <div
                  key={record.recordId}
                  onClick={() => navigate(`/document/${record.recordId}`)}
                  className="bg-white rounded-xl shadow p-4 cursor-pointer active:bg-orange-50"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="font-bold text-navy-800">Survey No: {record.surveyNo}</p>
                      <p className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin size={12} className="text-orange-500 shrink-0" />
                        <span className="truncate">
                          {record.village}, {record.taluka}, {record.district}
                        </span>
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      #{indexOfFirstRecord + idx + 1}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-[11px] font-medium ${landTypeClass(record.landType)}`}>
                      {record.landType}
                    </span>
                    <span className="px-2 py-1 rounded text-[11px] bg-gray-100 text-gray-700">
                      {record.landCategory || "N/A"}
                    </span>
                    <span className={`px-2 py-1 rounded text-[11px] font-medium ${roadClass(record.roadConnectivity)}`}>
                      Road: {record.roadConnectivity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Area (sqft)</p>
                      <p className="font-medium text-gray-800">{record.landAreaSqft?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">RR Rate (₹/sqft)</p>
                      <p className="font-medium text-gray-800">
                        ₹{record.readyReckonerRateRsSqft?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Govt Rate</p>
                      <p className="font-medium text-gray-800">{formatPrice(record.governmentRate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Sale Price</p>
                      <p className="font-medium text-gray-800">{formatPrice(record.salePrice)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Market Price</p>
                      <p className="font-bold text-orange-500">{formatPrice(record.currentMarketPrice)}</p>
                    </div>
                    <div className="bg-orange-50 rounded p-1.5">
                      <p className="text-gray-500 text-xs">AI Predicted</p>
                      <p className="font-bold">{renderPrediction(record)}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t grid grid-cols-5 gap-1 text-center text-[11px] text-gray-600">
                    <div><p className="text-gray-400">Highway</p>{record.distanceHighwayKm} km</div>
                    <div><p className="text-gray-400">City</p>{record.distanceCityKm} km</div>
                    <div><p className="text-gray-400">School</p>{record.distanceSchoolKm} km</div>
                    <div><p className="text-gray-400">Hospital</p>{record.distanceHospitalKm} km</div>
                    <div><p className="text-gray-400">Market</p>{record.distanceMarketKm} km</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-gray-600 text-center">
                Showing <span className="font-bold text-navy-800">{indexOfFirstRecord + 1}</span> to{" "}
                <span className="font-bold text-navy-800">
                  {Math.min(indexOfLastRecord, filteredRecords.length)}
                </span>{" "}
                of <span className="font-bold text-orange-500">{filteredRecords.length}</span> records
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={18} />
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm font-semibold transition ${
                          currentPage === pageNum
                            ? "bg-orange-500 text-white shadow-lg"
                            : "border border-gray-300 hover:bg-orange-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="px-1 sm:px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
