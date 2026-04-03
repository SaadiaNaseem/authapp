import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { isTokenExpired } from "./utils/auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

// Wrapper to handle auto token expiry modal
function DashboardWrapper() {
  const navigate = useNavigate();
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        setShowSessionExpired(true);
      }
    }, 1000); // check every 1 second

    return () => clearInterval(interval);
  }, []);

  const handleLoginRedirect = () => {
    localStorage.removeItem("token");
    setShowSessionExpired(false);
    navigate("/login");
  };

  return (
    <>
      <Dashboard />
      {showSessionExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-sm p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-4">Session Expired</h2>
            <p className="text-gray-400 mb-6">Your token has expired. Please login again.</p>
            <button
              onClick={handleLoginRedirect}
              className="px-6 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-700 transition-all"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}