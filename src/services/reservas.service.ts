import { api } from './api';

export interface BloqueHorario {
  horaInicio: string;
  horaFin: string;
  estado: 'DISPONIBLE' | 'OCUPADO';
}

export interface DisponibilidadResponse {
  espacio: string;
  minParticipantes: number;
  fecha: string;
  bloques: BloqueHorario[];
}

export interface ReservaActiva {
  id: string;
  espacioNombre?: string;
  espacio: { nombre: string };
  fechaInicio: string;
  fechaFin: string;
  cantidadPersonas: number;
  estado: string;
}

export const reservasService = {
  // RF-01: Obtener la grilla de disponibilidad del espacio deportivo
  obtenerDisponibilidad: async (espacioId: string, fecha: string): Promise<DisponibilidadResponse> => {
    const response = await api.get(`/reservas-espacios/disponibilidad?espacioId=${espacioId}&fecha=${fecha}`);
    return response.data;
  },

  // Obtener mis reservas activas
  obtenerMisReservas: async (): Promise<ReservaActiva[]> => {
    const response = await api.get('/reservas-espacios/mis-reservas');
    return response.data;
  },

  // RF-02 y RF-03: Crear una nueva reserva (bloque de 60 minutos)
  crearReserva: async (data: { espacioId: string; fechaInicio: string; cantidadPersonas: number }) => {
    const response = await api.post('/reservas-espacios', data);
    return response.data;
  },

  // RF-04: Cancelar reserva con 5h de anticipación
  cancelarReserva: async (reservaId: string) => {
    const response = await api.patch(`/reservas-espacios/${reservaId}/cancelar`);
    return response.data;
  },
};