import { useState, useEffect } from "react";
import { Search, Loader2, Users, Shield, User as UserIcon, Ban, CheckCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { adminAPI } from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to BLOCK "${userName}"?\n\nThey will not be able to login until you unblock them.`)) return;
    try {
      await adminAPI.blockUser(userId);
      alert("✅ User blocked successfully!");
      loadUsers();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    }
  };

  const handleUnblock = async (userId, userName) => {
    if (!window.confirm(`Unblock "${userName}"?`)) return;
    try {
      await adminAPI.unblockUser(userId);
      alert("✅ User unblocked successfully!");
      loadUsers();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`⚠️ PERMANENTLY DELETE "${userName}"?\n\nThis action CANNOT be undone!\nAll their data will be lost forever.`)) return;
    if (!window.confirm(`Really delete "${userName}"? Final confirmation!`)) return;
    try {
      await adminAPI.deleteUser(userId);
      alert("✅ User permanently deleted!");
      loadUsers();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile?.includes(search);
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    const matchesStatus = filterStatus === "ALL" || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  // Stats
  const citizenCount = users.filter((u) => u.role === "CITIZEN").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const blockedCount = users.filter((u) => u.status === "BLOCKED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
        <h1 className="text-2xl font-bold text-navy-800">Users Management</h1>
        <p className="text-sm text-gray-500">Home / Users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={users.length} color="bg-blue-500" />
        <StatCard icon={UserIcon} label="Citizens" value={citizenCount} color="bg-green-500" />
        <StatCard icon={Shield} label="Admins" value={adminCount} color="bg-orange-500" />
        <StatCard icon={Ban} label="Blocked" value={blockedCount} color="bg-red-500" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by Name, Email or Mobile..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="CITIZEN">Citizens</option>
            <option value="ADMIN">Admins</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
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
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">FULL NAME</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">EMAIL</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">MOBILE</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">ROLE</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">STATUS</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-800">REGISTERED</th>
                  <th className="px-4 py-3 text-center font-semibold text-navy-800">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr key={u.userId} className="border-b hover:bg-orange-50 transition">
                    <td className="px-4 py-3">{u.userId}</td>
                    <td className="px-4 py-3 font-semibold text-navy-800">{u.fullName}</td>
                    <td className="px-4 py-3 text-xs">{u.email}</td>
                    <td className="px-4 py-3">{u.mobile}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.role === "ADMIN"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 w-fit ${
                          u.status === "BLOCKED"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {u.status === "BLOCKED" ? <Ban size={12} /> : <CheckCircle size={12} />}
                        {u.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {u.role === "ADMIN" ? (
                        <span className="text-xs text-gray-400 italic">Protected</span>
                      ) : (
                        <div className="flex justify-center gap-2">
                          {u.status === "BLOCKED" ? (
                            <button
                              onClick={() => handleUnblock(u.userId, u.fullName)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded"
                              title="Unblock"
                            >
                              <CheckCircle size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlock(u.userId, u.fullName)}
                              className="p-2 text-orange-600 hover:bg-orange-100 rounded"
                              title="Block"
                            >
                              <Ban size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(u.userId, u.fullName)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                            title="Delete Permanently"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginatedUsers.length === 0 && (
              <div className="text-center py-12 text-gray-400">No users found</div>
            )}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-5 border-l-4 ${color.replace("bg-", "border-")}`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${color}/20 rounded-lg flex items-center justify-center`}>
          <Icon className={color.replace("bg-", "text-")} size={24} />
        </div>
        <div>
          <p className="text-3xl font-bold text-navy-800">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}

export function Pagination({ currentPage, totalPages, totalItems, onPageChange }) {
  if (totalPages <= 1) {
    return (
      <div className="p-4 border-t bg-gray-50 text-sm text-gray-600">
        Showing {totalItems} entries
      </div>
    );
  }

  return (
    <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
      <p className="text-sm text-gray-600">
        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalItems)} of {totalItems} entries
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
          .map((page, idx, arr) => (
            <div key={page} className="flex items-center">
              {idx > 0 && arr[idx - 1] !== page - 1 && (
                <span className="px-2 text-gray-400">...</span>
              )}
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-orange-500 text-white font-semibold"
                    : "border hover:bg-white"
                }`}
              >
                {page}
              </button>
            </div>
          ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default AdminUsers;