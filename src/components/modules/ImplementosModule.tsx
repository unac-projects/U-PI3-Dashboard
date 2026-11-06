import React from "react";

export const ImplementosModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Módulo de Préstamo de Implementos</h1>
        <p className="text-slate-500 text-sm">Consulta de inventario en tiempo real, solicitudes activas y escaneo QR.</p>
      </div>

      {/* Tarjetas Informativas de Inventario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Implementos Disponibles</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">24</h3>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-lg font-bold">
            ⚽
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Préstamos Activos</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">3</h3>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-lg font-bold">
            ⏳
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Devoluciones Pendientes</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">1</h3>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-lg font-bold">
            🔄
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Acciones de Préstamo</h2>
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition">
            + Solicitar Implemento
          </button>
          <button className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-4 py-2 rounded-lg text-sm transition">
            📷 Escanear QR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImplementosModule;
