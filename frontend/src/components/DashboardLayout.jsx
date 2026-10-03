import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Bell, ChevronDown, Menu, Globe, LogOut, User } from "lucide-react";
import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";

function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      {sidebarOpen && <DashboardSidebar />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header - Orange Navbar Style */}
        <header className="bg-orange-400 border-b-4 border-orange-500 shadow-lg sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-orange-500 rounded-lg text-white transition"
              >
                <Menu size={22} />
              </button>
              <h2 className="text-white font-bold text-lg drop-shadow-md">
                Citizen Dashboard
              </h2>
            </div>

            <div className="flex items-center gap-3">

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 bg-navy-800 hover:bg-navy-900 px-4 py-2 rounded-lg shadow-md transition"
                >
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                    <span className="text-navy-800 font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white leading-tight">{user?.name || "User"}</p>
                    <p className="text-xs text-orange-200 capitalize">{user?.role || "Citizen"}</p>
                  </div>
                  <ChevronDown size={16} className="text-white" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="bg-orange-400 p-3 border-b-4 border-orange-500">
                      <p className="text-white font-bold text-sm">{user?.name}</p>
                      <p className="text-xs text-navy-800">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      <User size={16} className="text-orange-500" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-200"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;