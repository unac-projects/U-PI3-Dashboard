import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState<{ nombre: string; correo: string; rol: string }>({
    nombre: "Usuario Bienestar",
    correo: "estudiante@unac.edu.co",
    rol: "ESTUDIANTE",
  });

  useEffect(() => {
    const userStored = localStorage.getItem("usuario");
    if (userStored) {
      try {
        setUsuario(JSON.parse(userStored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const navItems = [
    { label: "Inicio", path: "/dashboard", icon: "🏠" },
    { label: "Implementos", path: "/dashboard/implementos", icon: "📦" },
    { label: "Espacios", path: "/dashboard/espacios", icon: "⚽" },
    { label: "Citas", path: "/dashboard/citas", icon: "🩺" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div onClick={() => navigate("/dashboard")} className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">U</div>
          <span className="text-lg font-bold">BienestarU</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none">{usuario.nombre}</p>
            <p className="text-xs text-slate-400 mt-1">
              {usuario.correo} ({usuario.rol})
            </p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Estructura con Sidebar + Sub-rutas */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-6 gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-white rounded-2xl border border-slate-200 p-4 h-fit shadow-sm hidden md:block">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Menú</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Área de renderizado del módulo activo */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
