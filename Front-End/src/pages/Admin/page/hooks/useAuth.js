// src/hooks/useAuth.js
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../url";

export default function useAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("token_expiry");

      if (!token || !expiry) {
        logout();
        return;
      }

      const now = Date.now();
      const remaining = expiry - now;

      // ✅ Kalau sisa waktu < 0 → logout
      if (remaining <= 0) {
        logout();
        return;
      }

      // ✅ Kalau sisa waktu < 1 menit → refresh token
      if (remaining < 60 * 1000) {
        try {
          const res = await axios.post(
            `${BASE_URL}/api/refresh`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const newToken = res.data?.authorization?.token;
          if (newToken) {
            const newExpiry = Date.now() + 60 * 60 * 1000;
            localStorage.setItem("token", newToken);
            localStorage.setItem("token_expiry", newExpiry);
            console.log("🔄 Token refreshed successfully");
          } else {
            logout();
          }
        } catch (err) {
          console.error("❌ Refresh token failed", err);
          logout();
        }
      }
    };

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiry");
      navigate("/login");
    };

    // ✅ Jalankan pertama kali dan setiap 30 detik cek ulang
    checkToken();
    const interval = setInterval(checkToken, 30 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);
}
