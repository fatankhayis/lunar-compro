import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Handshake,
  FolderKanban,
  UserStar,
  FileText,
  LogOut,
  Clock,
  Package,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../../url";
import toast from "react-hot-toast";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { path: "/admin/crew", label: "Crew", icon: <Users className="w-5 h-5" /> },
    { path: "/admin/product", label: "Product", icon: <Package className="w-5 h-5" /> },
    {
      path: "/admin/project",
      label: "Project",
      icon: <FolderKanban className="w-5 h-5" />,
    },
    {
      path: "/admin/partnership",
      label: "Partnership",
      icon: <Handshake className="w-5 h-5" />,
    },
    {
      path: "/admin/testimonial",
      label: "Testimonial",
      icon: <UserStar className="w-5 h-5" />,
    },
    {
      path: "/admin/blog",
      label: "Blog",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  // 🕒 Hitung waktu tersisa token
  useEffect(() => {
    const updateTimer = () => {
      const expiry = localStorage.getItem("token_expiry");
      if (!expiry) {
        setTimeLeft("No token");
        return;
      }

      const now = Date.now();
      const remaining = expiry - now;

      if (remaining <= 0) {
        setTimeLeft("Expired");
        toast.error("Sesi kamu telah berakhir");
        // 🧹 Auto logout
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        navigate("/login");
        return;
      }

      const minutes = Math.floor(remaining / 1000 / 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      setTimeLeft(`${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `${BASE_URL}/api/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.warn("Logout API gagal (mungkin token sudah expired).", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiry");
      localStorage.removeItem("refresh_token");
      // 🔹 Hapus juga sidebar state saat logout
      localStorage.removeItem("sidebarOpen");

      toast.success("Logout berhasil");

      setTimeout(() => navigate("/login"), 800);
    }
  };

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <aside className={`
        fixed left-0 top-0 h-screen bg-white shadow-lg flex flex-col justify-between
        transition-all duration-300 z-50
        ${isOpen ? 'w-64' : 'w-16'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* 🔹 HEADER */}
        <div className={`p-4 border-b border-gray-200 ${isOpen ? 'px-6' : 'px-4'}`}>
          <div className="flex items-center justify-between">
            {isOpen ? (
              <>
                <h2 className="text-xl font-semibold">Admin Panel</h2>
                <button
                  onClick={toggleSidebar}
                  className="p-1 rounded-md hover:bg-gray-100 transition"
                  title="Tutup Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-gray-100 transition w-full flex justify-center"
                title="Buka Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 🔹 MENU NAVIGASI */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center rounded-md transition ${
                    isActive
                      ? "bg-bgtre text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${isOpen ? 'gap-3 p-3' : 'justify-center p-2'}`
                }
                title={!isOpen ? item.label : ""}
              >
                {item.icon}
                {isOpen && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* 🔹 FOOTER - TIMER & LOGOUT */}
        <div className={`border-t border-gray-200 ${isOpen ? 'p-4' : 'p-2'}`}>
          {/* Timer */}
          <div className={`flex items-center ${isOpen ? 'gap-2 mb-3' : 'justify-center mb-2'}`}>
            <Clock className="w-4 h-4 text-gray-500" />
            {isOpen && (
              <div className="text-gray-500 text-sm">
                <span>Expires: </span>
                <span
                  className={`font-medium ${
                    timeLeft === "Expired" ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  {timeLeft}
                </span>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center text-red-600 hover:text-red-800 transition w-full ${
              isOpen ? 'gap-2 p-2' : 'justify-center p-2'
            }`}
            title={!isOpen ? "Logout" : ""}
          >
            <LogOut className="w-4 h-4" />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}