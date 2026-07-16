import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import NotificationPopup from "./components/NotificationPopup";
import useAuth from "./page/hooks/useAuth";
import useMessageNotifications from "./page/hooks/useMessageNotifications";

export default function AdminLayout() {
  useAuth(); // aktifkan proteksi dan refresh token

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [notification, setNotification] = useState(null);
  const location = useLocation();
  const userRole = localStorage.getItem("user_role");

  const isAdminPage = location.pathname.startsWith("/admin");
  // Only show notifications to super_admin
  const isSuperAdmin = userRole === "super_admin";

  useMessageNotifications((message) => {
    setNotification(message);
  }, isSuperAdmin && isAdminPage);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <div className="p-4">
          <Outlet />
        </div>
      </main>

      {notification && isSuperAdmin && (
        <NotificationPopup
          notification={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}