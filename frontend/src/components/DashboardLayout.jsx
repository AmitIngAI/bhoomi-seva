import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";

function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const closeOnMobile = () => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full overflow-x-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <div
          onClick={closeOnMobile}
          className="fixed inset-y-0 left-0 z-50 overflow-y-auto lg:static lg:z-auto lg:shrink-0"
        >
          <DashboardSidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-orange-400 border-b-4 border-orange-500 shadow-lg sticky top-0 z-30">
          <div className="flex items-center justify-between px-3 sm:px-6 py-3 gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-orange-500 rounded-lg text-white transition shrink-0"
              >
                <Menu size={22} />
              </button>
              <h2 className="text-white font-bold text-base sm:text-lg drop-shadow-md truncate">
                Citizen Dashboard
              </h2>
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 sm:gap-3 bg-navy-800 hover:bg-navy-900 px-2 sm:px-4 py-2 rounded-lg shadow-md transition"
              >
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                  <span className="text-navy-800 font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-bold text-white leading-tight">{user?.name || "User"}</p>
                  <p className="text-xs text-orange-200 capitalize">{user?.role || "Citizen"}</p>
                </div>
                <ChevronDown size={16} className="text-white" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50">
                  <div className="bg-orange-400 p-3 border-b-4 border-orange-500">
                    <p className="text-white font-bold text-sm">{user?.name}</p>
                    <p className="text-xs text-navy-800 break-all">{user?.email}</p>
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
        </header>

        <main className="flex-1 min-w-0 p-3 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
