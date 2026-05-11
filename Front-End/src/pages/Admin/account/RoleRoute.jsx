import React from "react";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("user_role");

  // Jika tidak ada token, kembalikan ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika role belum ada (mis. token lama), paksa re-login supaya role tersimpan dengan benar
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Jika peran pengguna tidak diizinkan, kembalikan ke dashboard atau halaman yang aman
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default RoleRoute;
