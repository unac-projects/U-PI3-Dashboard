import React from "react";

export const CitasModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Módulo de Citas de Atención</h1>
        <p className="text-slate-500 text-sm">Agendamiento de consultas de Salud, Psicología y Área Espiritual.</p>
      </div>
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        📌 Módulo asignado a Gabriel Arteaga.
      </div>
    </div>
  );
};

export default CitasModule;
