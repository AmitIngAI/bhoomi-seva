import { Settings, User, Bell, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function DashboardSettings() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-800 mb-1">Settings</h1>
      <p className="text-gray-600 text-sm mb-6">Manage your account preferences</p>

      <div className="grid gap-4">
        <div className="bg-white rounded-xl card-shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-orange-500" size={24} />
            <h3 className="font-bold text-navy-800">Profile Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Name</label>
              <p className="font-medium text-navy-800">{user?.name}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Email</label>
              <p className="font-medium text-navy-800">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl card-shadow p-6">
          <div className="flex items-center gap-3">
            <Bell className="text-orange-500" size={24} />
            <h3 className="font-bold text-navy-800">Notifications</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl card-shadow p-6">
          <div className="flex items-center gap-3">
            <Shield className="text-orange-500" size={24} />
            <h3 className="font-bold text-navy-800">Security</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSettings;
