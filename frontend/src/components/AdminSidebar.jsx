import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Database, FileText, FileBadge, Building2,
  Users, Settings, LogOut, HelpCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { contactAPI } from "../services/api";
import { Mail } from "lucide-react";

  function AdminSidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
      const fetchUnread = async () => {
        try {
          const res = await contactAPI.getUnreadCount();
          setUnreadMessages(res.data?.count || 0);
        } catch (err) { console.error(err); }
      };
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000);
      return () => clearInterval(interval);
    }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Database, label: "Land Records", path: "/admin/land-records" },
    { icon: FileText, label: "7/12 Extract", path: "/admin/satbara" },
    { icon: FileBadge, label: "8A Record", path: "/admin/eight-a" },
    { icon: Building2, label: "Property Cards", path: "/admin/property-cards" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Mail, label: "Messages", path: "/admin/messages", badge: unreadMessages > 0 ? unreadMessages : null },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-navy-800 text-white h-screen flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="p-5 border-b border-navy-700 flex items-center gap-3">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full p-1">
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
          <h2 className="text-sm font-bold font-hindi text-orange-400">भूमि-सेवा</h2>
          <p className="text-xs text-gray-300">Admin Panel</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
      {menuItems.map((item, idx) => (
        <NavLink key={idx} to={item.path} end={item.path === "/admin"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-3 hover:bg-navy-700 transition ${
              isActive ? "bg-orange-500 border-l-4 border-white" : "border-l-4 border-transparent"
            }`
          }>
          <item.icon size={20} />
          <span className="text-sm font-medium flex-1">{item.label}</span>
          {item.badge && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.badge}</span>
          )}
        </NavLink>
      ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-navy-700 p-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 w-full hover:bg-red-600 transition rounded"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      {/* Support */}
      <div className="p-4 border-t border-navy-700 bg-navy-900">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={16} className="text-orange-400" />
          <p className="text-xs font-semibold">Need Help?</p>
        </div>
        <p className="text-xs text-gray-400">Contact IT Support</p>
        <p className="text-xs text-orange-400 font-semibold">1800-123-4567</p>
      </div>
    </aside>
  );
}

export default AdminSidebar;