import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Kalau token tidak ada, redirect ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Kalau ada token, render komponen anak
  return children;
};

export default PrivateRoute;
