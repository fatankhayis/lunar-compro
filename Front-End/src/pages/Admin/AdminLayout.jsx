import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import useAuth from "./page/hooks/useAuth";

export default function AdminLayout() {
  useAuth(); // ✅ aktifkan proteksi dan refresh token
  
  // 🔹 Ambil state dari localStorage, default true (terbuka)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

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
    </div>
  );
}