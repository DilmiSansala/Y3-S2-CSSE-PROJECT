// src/pages/AdminLogin.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3050/api/auth/login", {
        email,
        password,
      });

      if (res.status === 200 && res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data?.user?.role || "admin");
        navigate("/admin-dashboard");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-extrabold tracking-tight text-center text-emerald-800 mb-6">
          Admin Login
        </h2>

        <div className="bg-white border border-emerald-100 rounded-2xl shadow-xl shadow-emerald-900/5 p-6 sm:p-8">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="block text-sm font-medium text-emerald-900 mb-1">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zerowaste.gov"
                className="w-full rounded-xl border border-emerald-200 bg-white/80
                           px-4 py-2.5 text-emerald-900 placeholder-emerald-800/40
                           outline-none ring-2 ring-transparent transition
                           focus:border-emerald-500 focus:ring-emerald-200"
                required
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-emerald-900 mb-1">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-emerald-200 bg-white/80
                           px-4 py-2.5 text-emerald-900 placeholder-emerald-800/40
                           outline-none ring-2 ring-transparent transition
                           focus:border-emerald-500 focus:ring-emerald-200"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center rounded-xl
                         bg-emerald-700 px-4 py-3 font-semibold text-white
                         shadow-md shadow-emerald-900/10 transition
                         hover:bg-emerald-800 focus:outline-none focus-visible:ring-2
                         focus-visible:ring-emerald-400"
            >
              Login
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-emerald-800/60">
          ZeroWaste • secure access
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
