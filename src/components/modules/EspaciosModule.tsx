import React, { useState, useEffect } from 'react';
import { reservasService } from '../../services/reservas.service';
import type { BloqueHorario, ReservaActiva } from '../../services/reservas.service';

const ESPACIOS_DEPORTIVOS = [
  { id: 'c3d31769-4782-44d1-af26-f8ee8da3ef94', nombre: 'Cancha multiple principal', minParticipantes: 10 },
  { id: 'd723d897-1506-4e01-a4cf-1f3f8af3d167', nombre: 'Cancha de Fútbol 11', minParticipantes: 20 },
  { id: 'f166d611-3287-42c7-9dec-579b5eae2692', nombre: 'Cancha multiple secundaria', minParticipantes: 10 },
  { id: 'a04628c4-1d22-46da-b50b-02d94dff0023', nombre: 'Cancha futbol 7', minParticipantes: 10 },
  { id: '52400d11-c973-42cd-a229-9eb818b84a50', nombre: 'Cancha futbol 7-1 bolivar', minParticipantes: 10 },
  { id: '279c2111-2ade-4467-88e9-855ef97c35ff', nombre: 'Cancha futbol 7-2 bolivar', minParticipantes: 10 }
];

export const EspaciosModule: React.FC = () => {
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(ESPACIOS_DEPORTIVOS[0].id);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [bloques, setBloques] = useState<BloqueHorario[]>([]);
  const [misReservas, setMisReservas] = useState<ReservaActiva[]>([]);
  const [loading, setLoading] = useState(false);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<BloqueHorario | null>(null);
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const cargarDisponibilidad = async () => {
    setLoading(true);
    try {
      const data = await reservasService.obtenerDisponibilidad(espacioSeleccionado, fecha);
      setBloques(data.bloques);
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: 'No se pudo cargar la disponibilidad del espacio.' });
    } finally {
      setLoading(false);
    }
  };

  const cargarMisReservas = async () => {
    try {
      const data = await reservasService.obtenerMisReservas();
      setMisReservas(data);
    } catch (err) {
      // Manejo silencioso si el endpoint no está implementado
    }
  };

  useEffect(() => {
    if (espacioSeleccionado && fecha) {
      cargarDisponibilidad();
      cargarMisReservas();
    }
  }, [espacioSeleccionado, fecha]);

  const handleReservar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloqueSeleccionado) return;

    setLoading(true);
    setMensaje(null);

    const fechaInicioISO = `${fecha}T${bloqueSeleccionado.horaInicio}:00.000Z`;

    try {
      await reservasService.crearReserva({
        espacioId: espacioSeleccionado,
        fechaInicio: fechaInicioISO,
        cantidadPersonas: Number(cantidadPersonas),
      });

      setMensaje({ tipo: 'exito', texto: '¡Reserva confirmada exitosamente!' });
      setBloqueSeleccionado(null);
      cargarDisponibilidad();
      cargarMisReservas();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al procesar la reserva.';
      setMensaje({ tipo: 'error', texto: Array.isArray(msg) ? msg.join(', ') : msg });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarReserva = async (reservaId: string) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva? Recuerda que debe hacerse con al menos 5 horas de anticipación.')) {
      return;
    }

    setLoading(true);
    setMensaje(null);

    try {
      await reservasService.cancelarReserva(reservaId);
      setMensaje({ tipo: 'exito', texto: 'La reserva ha sido cancelada correctamente.' });
      cargarDisponibilidad();
      cargarMisReservas();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'No se pudo cancelar la reserva (Recuerda el límite de 5 horas de anticipación).';
      setMensaje({ tipo: 'error', texto: Array.isArray(msg) ? msg.join(', ') : msg });
    } finally {
      setLoading(false);
    }
  };

  const espacioActual = ESPACIOS_DEPORTIVOS.find((e) => e.id === espacioSeleccionado);

  return (
    <div style={{ padding: '10px 0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>Módulo de Espacios Deportivos</h2>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>Reserva de canchas y escenarios en bloques de 60 minutos.</p>

      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        
        {/* Selector de Espacio y Fecha */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Seleccionar Espacio:</label>
            <select
              value={espacioSeleccionado}
              onChange={(e) => setEspacioSeleccionado(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            >
              {ESPACIOS_DEPORTIVOS.map((esp) => (
                <option key={esp.id} value={esp.id}>
                  {esp.nombre} (Mín. {esp.minParticipantes} pers.)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Fecha de Reserva:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>
        </div>

        {/* Mensajes de Feedback */}
        {mensaje && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              backgroundColor: mensaje.tipo === 'exito' ? '#d1fae5' : '#fee2e2',
              color: mensaje.tipo === 'exito' ? '#065f46' : '#991b1b',
              fontWeight: '500',
            }}
          >
            {mensaje.texto}
          </div>
        )}

        {/* Horarios Disponibles */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>Horarios Disponibles (8:00 AM - 6:00 PM)</h3>
        
        {loading ? (
          <p style={{ color: '#6b7280' }}>Cargando disponibilidad...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '30px' }}>
            {bloques.map((b) => {
              const esDisponible = b.estado === 'DISPONIBLE';
              const esSeleccionado = bloqueSeleccionado?.horaInicio === b.horaInicio;

              return (
                <button
                  key={b.horaInicio}
                  disabled={!esDisponible}
                  onClick={() => setBloqueSeleccionado(b)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: esDisponible ? (esSeleccionado ? '#2563eb' : '#10b981') : '#ef4444',
                    color: '#ffffff',
                    cursor: esDisponible ? 'pointer' : 'not-allowed',
                    opacity: esDisponible ? 1 : 0.5,
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{b.horaInicio} - {b.horaFin}</div>
                  <small style={{ fontSize: '0.75rem' }}>{b.estado}</small>
                </button>
              );
            })}
          </div>
        )}

        {/* Modal de Confirmación */}
        {bloqueSeleccionado && (
          <div style={{ marginBottom: '30px', padding: '16px', border: '1px solid #93c5fd', borderRadius: '8px', backgroundColor: '#eff6ff' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Confirmar Reserva: {espacioActual?.nombre}</h4>
            <p style={{ marginBottom: '12px' }}>
              Bloque: <strong>{bloqueSeleccionado.horaInicio} - {bloqueSeleccionado.horaFin}</strong> ({fecha})
            </p>

            <form onSubmit={handleReservar}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>
                  Cantidad de Asistentes:
                </label>
                <input
                  type="number"
                  min={espacioActual?.minParticipantes || 1}
                  value={cantidadPersonas}
                  onChange={(e) => setCantidadPersonas(Number(e.target.value))}
                  required
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', width: '120px' }}
                />
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
                  Mínimo requerido: {espacioActual?.minParticipantes} personas.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  {loading ? 'Reservando...' : 'Confirmar Reserva'}
                </button>
                <button
                  type="button"
                  onClick={() => setBloqueSeleccionado(null)}
                  style={{ padding: '8px 16px', backgroundColor: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sección de Cancelación / Mis Reservas */}
        {misReservas.length > 0 && (
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>Mis Reservas Activas</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '10px' }}>Espacio</th>
                    <th style={{ padding: '10px' }}>Fecha y Hora</th>
                    <th style={{ padding: '10px' }}>Personas</th>
                    <th style={{ padding: '10px' }}>Estado</th>
                    <th style={{ padding: '10px' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {misReservas.map((res) => (
                    <tr key={res.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px' }}>{res.espacio?.nombre || res.espacioNombre || 'Espacio Deportivo'}</td>
                      <td style={{ padding: '10px' }}>{new Date(res.fechaInicio).toLocaleString()}</td>
                      <td style={{ padding: '10px' }}>{res.cantidadPersonas}</td>
                      <td style={{ padding: '10px', color: res.estado === 'CANCELADA' ? '#ef4444' : '#10b981', fontWeight: '600' }}>
                        {res.estado}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {res.estado !== 'CANCELADA' && (
                          <button
                            onClick={() => handleCancelarReserva(res.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                            }}
                          >
                            Cancelar Reserva
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EspaciosModule;