import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 min-w-0 ml-0 lg:ml-64">
        {/* Top Header */}
        <header className="bg-orange-500 shadow-md sticky top-0 z-20 border-b-4 border-orange-600">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white p-1"
                aria-label="Open menu"
              >
                <Menu size={26} />
              </button>
              <h1 className="text-lg lg:text-xl font-bold text-white">Admin Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* User Profile */}
              <div className="flex items-center gap-2 bg-navy-800 px-2 sm:px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-navy-800 font-bold text-sm">
                    {user?.fullName?.charAt(0) || "A"}
                  </span>
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-white text-sm font-semibold">{user?.fullName || "Admin"}</p>
                  <p className="text-xs text-orange-200">Super Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
