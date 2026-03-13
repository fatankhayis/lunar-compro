import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../url";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) return toast.error("Email and password are required");

    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/login`, form);
      const token = data?.authorization?.token;

      if (!token) return toast.error("Token not found!");

      // save token + expiration time
      const expiresAt = Date.now() + 60 * 60 * 1000;
      localStorage.setItem("token", token);
      localStorage.setItem("token_expiry", expiresAt);

      toast.success("Login successful");
      setTimeout(() => navigate("/admin"), 600);
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      toast.error(status === 401 ? "Invalid email or password" : "An error occurred, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bgone to-bg">
      <div className="backdrop-blur-md bg-white/10 border border-white/30 shadow-2xl rounded-2xl p-8 w-full max-w-sm text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={<Mail size={20} />}
          />

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-white/80">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-12 py-2 rounded-full bg-white/20 text-white placeholder-white/60 
                         focus:outline-none focus:ring-2 focus:ring-white/50 transition pr-12"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                <Lock size={20} />
              </div>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-full transition text-white font-medium shadow-md cursor-pointer
              ${loading ? "bg-black/50 cursor-not-allowed" : "bg-black/70 hover:bg-black/90"} flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin "></div>
                Loading...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================================
   🔹 Reusable input component with icon
================================ */
const InputField = ({ label, name, type, value, onChange, placeholder, icon }) => (
  <div>
    <label className="block text-sm mb-1 text-white/80">{label}</label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-12 py-2 rounded-full bg-white/20 text-white placeholder-white/60 
                 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
        {icon}
      </div>
    </div>
  </div>
);