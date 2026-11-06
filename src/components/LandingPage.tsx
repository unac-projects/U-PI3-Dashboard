import React, { useState } from "react";
import LoginModal from "./LoginModal";

export const LandingPage: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 1. Navegación Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">U</div>
          <span className="text-xl font-bold text-slate-900">BienestarU</span>
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#servicios" className="hover:text-blue-600 transition">
            Servicios
          </a>
          <a href="#deportes" className="hover:text-blue-600 transition">
            Espacios Deportivos
          </a>
          <a href="#citas" className="hover:text-blue-600 transition">
            Atención Integral
          </a>
        </nav>

        <button
          onClick={() => setIsLoginOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm shadow transition"
        >
          Iniciar Sesión
        </button>
      </header>

      {/* 2. Sección Hero */}
      <section className="max-w-6xl mx-auto text-center py-20 px-4">
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Plataforma Institucional UNAC
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-4 leading-tight">
          Tu bienestar universitario <br /> en un solo lugar
        </h1>
        <p className="text-lg text-slate-600 mt-6 max-w-2xl mx-auto">
          Reserva canchas deportivas, agenda citas con profesionales de la salud y gestiona préstamos de implementos de manera
          rápida y sencilla.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
          >
            Acceder al Portal
          </button>
        </div>
      </section>

      {/* 3. Sección de Módulos Principal */}
      <section id="servicios" className="max-w-6xl mx-auto py-12 px-4 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl font-bold mb-4">
            ⚽
          </div>
          <h3 className="text-xl font-bold mb-2">Espacios Deportivos</h3>
          <p className="text-slate-600 text-sm">
            Consulta disponibilidad y reserva canchas deportivas para tus actividades académicas o recreativas.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl font-bold mb-4">
            🩺
          </div>
          <h3 className="text-xl font-bold mb-2">Citas de Atención</h3>
          <p className="text-slate-600 text-sm">
            Agenda turnos y citas de atención personalizada en las áreas de salud y psicología del CAU.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xl font-bold mb-4">
            📦
          </div>
          <h3 className="text-xl font-bold mb-2">Préstamo de Implementos</h3>
          <p className="text-slate-600 text-sm">
            Solicita implementos deportivos mediante código QR y mantén el control de tus préstamos activos.
          </p>
        </div>
      </section>

      {/* Renderizado del Modal de Login */}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
};

export default LandingPage;
