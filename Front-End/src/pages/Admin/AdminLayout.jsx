import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import NotificationPopup from "./components/NotificationPopup";
import useAuth from "./page/hooks/useAuth";
import useMessageNotifications from "./page/hooks/useMessageNotifications";

export default function AdminLayout() {
  useAuth(); // ✅ aktifkan proteksi dan refresh token
  
  // 🔹 Ambil state dari localStorage, default true (terbuka)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [notification, setNotification] = useState(null);
  const location = useLocation();
  
  // 🔹 Cek role user
  const userRole = localStorage.getItem("user_role") || "super_admin";
  
  // Detect jika user sedang di halaman admin (any admin page)
  const isAdminPage = location.pathname.startsWith('/admin');

  // 🔔 Polling untuk messages baru HANYA jika super admin
  const shouldPollMessages = isAdminPage && userRole === 'super_admin';
  useMessageNotifications((message) => {
    setNotification(message);
  }, shouldPollMessages);

  // 🔹 Simpan ke localStorage setiap kali sidebarOpen berubah
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <div className="p-4">
          <Outlet />
        </div>
      </main>

      {/* 🔔 Notification Popup */}
      {notification && (
        <NotificationPopup
          notification={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}