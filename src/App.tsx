import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import DashboardHome from "./components/modules/DashboardHome";
import ImplementosModule from "./components/modules/ImplementosModule";
import EspaciosModule from "./components/modules/EspaciosModule";
import CitasModule from "./components/modules/CitasModule";

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token) {
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("usuario", user);
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page en la raíz */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />

        {/* Rutas del Dashboard protegido con Sub-rutas */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" replace />}>
          <Route index element={<DashboardHome />} />
          <Route path="implementos" element={<ImplementosModule />} />
          <Route path="espacios" element={<EspaciosModule />} />
          <Route path="citas" element={<CitasModule />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
