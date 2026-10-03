import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Save, Lock, Eye, EyeOff, X, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

function DashboardProfile() {
  const { user, login } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    mobile: user?.mobile || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await authAPI.updateProfile({
        userId: user.id,
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
      });

      // Update auth context with new data
      const updatedUser = {
        ...user,
        name: response.data.fullName,
        email: response.data.email,
        mobile: response.data.mobile,
      };
      login(updatedUser, sessionStorage.getItem("bhoomi_token"));

      setMessage({ text: "✅ Profile updated successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Update failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ text: "Password must be at least 6 characters", type: "error" });
      return;
    }

    setLoading(true);

    try {
      await authAPI.changePassword({
        userId: user.id,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setMessage({ text: "✅ Password changed successfully!", type: "success" });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setShowPasswordModal(false);
        setMessage({ text: "", type: "" });
      }, 1500);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Password change failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-orange-500 hover:underline">Dashboard</Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700 font-semibold">Profile Management</span>
      </div>

      <h1 className="text-2xl font-bold text-navy-800">Profile Management</h1>

      {message.text && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          message.type === "success"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-orange-500 p-6 text-center">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-4 shadow-lg">
            <User size={60} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-navy-800">{user?.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          <div className="mt-4 bg-orange-50 rounded-lg p-3 text-left">
            <p className="text-xs text-gray-600">Registered On</p>
            <p className="text-sm font-bold text-navy-800">15 Mar 2024</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg font-semibold text-sm transition shadow-md"
          >
            <Lock size={14} /> Change Password
          </button>
        </div>

        {/* Form */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg border-t-4 border-orange-500 p-6">
          <h3 className="text-lg font-bold text-navy-800 mb-4">Personal Information</h3>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                <input
                  type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                <input
                  type="tel" name="mobile" value={formData.mobile} onChange={handleChange}
                  pattern="[0-9]{10}" maxLength="10" required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit" disabled={loading}
                className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-md disabled:opacity-50 transition"
              >
                <Save size={16} /> {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          onClick={() => setShowPasswordModal(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={20} />
                <h3 className="text-lg font-bold">Change Password</h3>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="hover:bg-orange-600 p-1 rounded">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              {message.text && showPasswordModal && (
                <div className={`px-4 py-2 rounded text-sm ${
                  message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {message.text}
                </div>
              )}

              {[
                { field: "oldPassword", label: "Current Password", key: "old" },
                { field: "newPassword", label: "New Password", key: "new" },
                { field: "confirmPassword", label: "Confirm New Password", key: "confirm" },
              ].map(({ field, label, key }) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                    <input
                      type={showPass[key] ? "text" : "password"}
                      value={passwordData[field]}
                      onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })}
                      required minLength={6}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass({ ...showPass, [key]: !showPass[key] })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPass[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800">
                💡 Password must be at least 6 characters
              </div>

              <div className="flex gap-2">
                <button
                  type="button" onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={loading}
                  className="flex-1 bg-navy-800 hover:bg-navy-900 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardProfile;