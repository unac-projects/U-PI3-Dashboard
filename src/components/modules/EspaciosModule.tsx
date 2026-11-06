import React from "react";

export const EspaciosModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Módulo de Espacios Deportivos</h1>
        <p className="text-slate-500 text-sm">Reserva de canchas y escenarios en bloques de 60 minutos.</p>
      </div>
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        📌 Módulo asignado a Duvan Duarte.
      </div>
    </div>
  );
};

export default EspaciosModule;
