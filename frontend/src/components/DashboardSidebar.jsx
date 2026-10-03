import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { notificationAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Search, FileText, FileBadge, TrendingUp,
  MapPin, RefreshCw, Download, QrCode, User, Bell,
  Headphones, LogOut, HelpCircle
} from "lucide-react";

  function DashboardSidebar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
      if (user?.id) {
        const fetchUnread = async () => {
          try {
            const res = await notificationAPI.getUnreadCount(user.id);
            setUnreadCount(res.data?.count || 0);
          } catch (err) { console.error(err); }
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
      }
    }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

    const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
    { path: "/dashboard/search", icon: Search, label: "Search Land Record" },
    { path: "/dashboard/my-lands", icon: FileText, label: "My Land Records" },
    { path: "/dashboard/satbara", icon: FileBadge, label: "7/12 Extract" },
    { path: "/dashboard/eight-a", icon: FileBadge, label: "8A Record" },
    { path: "/dashboard/property-card", icon: FileBadge, label: "Property Card" },
    { path: "/dashboard/predictions", icon: TrendingUp, label: "Land Value Prediction" },
    { path: "/dashboard/map", icon: MapPin, label: "GIS Map View" },
    { path: "/dashboard/notifications", icon: Bell, label: "Notifications", badge: unreadCount > 0 ? unreadCount : null },
    { path: "/dashboard/downloads", icon: Download, label: "Downloaded Documents" },
    { path: "/dashboard/profile", icon: User, label: "Profile Management" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto flex flex-col shadow-lg">
      {/* Logo Header - Same as Navbar */}
      <div className="bg-orange-400 border-b-4 border-orange-500 p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full p-1 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1E3A8A" strokeWidth="3"/>
              <circle cx="50" cy="50" r="8" fill="#1E3A8A"/>
              {[...Array(24)].map((_, i) => (
                <line key={i} x1="50" y1="50"
                  x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                  y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                  stroke="#1E3A8A" strokeWidth="1.5"/>
              ))}
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold font-hindi text-white leading-tight drop-shadow-md">
              भूमि-सेवा
            </h1>
            <p className="text-xs font-bold text-navy-800 leading-tight">
              Bhoomi Seva
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-orange-400 text-white border-l-4 border-navy-800 font-bold shadow-md"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-l-4 border-transparent"
              }`
            }
          >
            <item.icon size={18} />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="bg-navy-800 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-l-4 border-transparent hover:border-red-500"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>

      {/* Help Card */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg p-3 flex items-start gap-2 shadow-md">
          <HelpCircle className="text-white flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs font-bold text-white">Need Help?</p>
            <p className="text-xs text-white font-semibold">Contact Support</p>
            <p className="text-xs text-white mt-1">1800-123-4567</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;