import React from "react";
import { useNavigate } from "react-router-dom";

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Panel Principal</h1>
        <p className="text-slate-600 mt-1">Selecciona uno de los servicios disponibles de BienestarU:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta Préstamo de Implementos */}
        <div
          onClick={() => navigate("/dashboard/implementos")}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer hover:border-blue-500 group"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-105 transition">
            📦
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Préstamo de Implementos</h3>
          <p className="text-slate-500 text-sm mb-4">
            Solicita material deportivo, consulta stock en tiempo real y gestiona tus devoluciones.
          </p>
          <span className="text-blue-600 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
            Ingresar al Módulo →
          </span>
        </div>

        {/* Tarjeta Espacios Deportivos */}
        <div
          onClick={() => navigate("/dashboard/espacios")}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer hover:border-green-500 group"
        >
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-105 transition">
            ⚽
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Espacios Deportivos</h3>
          <p className="text-slate-500 text-sm mb-4">
            Consulta disponibilidad y reserva bloques de horario para canchas e instalaciones.
          </p>
          <span className="text-green-600 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
            Ingresar al Módulo →
          </span>
        </div>

        {/* Tarjeta Citas de Atención */}
        <div
          onClick={() => navigate("/dashboard/citas")}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer hover:border-purple-500 group"
        >
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-105 transition">
            🩺
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Citas de Atención</h3>
          <p className="text-slate-500 text-sm mb-4">
            Agende turnos con profesionales de salud, orientación psicológica y espiritual.
          </p>
          <span className="text-purple-600 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
            Ingresar al Módulo →
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
