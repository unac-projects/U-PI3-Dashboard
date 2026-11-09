import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface Implemento {
  id: number;
  nombre: string;
  descripcion?: string;
  stockDisponible: number;
  stockTotal: number;
  categoria?: string;
}

interface Prestamo {
  id: number;
  tokenQr: string;
  estado: string;
  fechaSolicitud: string;
  implemento: Implemento;
}

export const ImplementosModule: React.FC = () => {
  const [rolUsuario, setRolUsuario] = useState<"ESTUDIANTE" | "ENCARGADO">("ESTUDIANTE");
  const [tabEstudiante, setTabEstudiante] = useState<"CATALOGO" | "MIS_PRESTAMOS">("CATALOGO");

  const [inventario, setInventario] = useState<Implemento[]>([]);
  const [misPrestamos, setMisPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal Formulario CRUD (Encargado)
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    stockTotal: 1,
    categoria: "Deportes",
  });

  // Modal para Mostrar QR (Salida o Devolución)
  const [qrModalData, setQrModalData] = useState<{ tokenQr: string; titulo: string; desc: string } | null>(null);
  const [tokenInput, setTokenInput] = useState<string>("");

  // 1. Cargar Datos
  const cargarInventario = async () => {
    try {
      const res = await fetch("http://localhost:3000/implementos");
      if (res.ok) setInventario(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarMisPrestamos = async () => {
    try {
      const res = await fetch("http://localhost:3000/implementos/mis-prestamos/1"); // Usuario ID 1
      if (res.ok) setMisPrestamos(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarInventario();
    cargarMisPrestamos();
  }, []);

  // 2. Guardar Implemento (CRUD Admin)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editandoId ? `http://localhost:3000/implementos/${editandoId}` : "http://localhost:3000/implementos";
    const method = editandoId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        resetForm();
        cargarInventario();
      } else {
        const err = await res.json();
        alert(err.message || "Error al guardar");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  // 3. Eliminar Implemento (CRUD Admin)
  const handleEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este implemento?")) return;
    try {
      const res = await fetch(`http://localhost:3000/implementos/${id}`, { method: "DELETE" });
      if (res.ok) {
        cargarInventario();
      } else {
        const err = await res.json();
        alert(err.message || "No se pudo eliminar");
      }
    } catch {
      alert("Error al conectar");
    }
  };

  const abrirEditar = (item: Implemento) => {
    setEditandoId(item.id);
    setFormData({
      nombre: item.nombre,
      descripcion: item.descripcion || "",
      stockTotal: item.stockTotal,
      categoria: item.categoria || "Deportes",
    });
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditandoId(null);
    setFormData({ nombre: "", descripcion: "", stockTotal: 1, categoria: "Deportes" });
  };

  // 4. RF-10: Solicitar Préstamo (Estudiante)
  const solicitar = async (implementoId: number) => {
    try {
      const res = await fetch("http://localhost:3000/implementos/solicitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: 1, implementoId }),
      });
      const data = await res.json();
      if (res.ok) {
        setQrModalData({
          tokenQr: data.tokenQr,
          titulo: "QR de Reclamo (Entrega)",
          desc: "Muestra este código al encargado para que te entregue el implemento.",
        });
        cargarInventario();
        cargarMisPrestamos();
      } else {
        alert(data.message || "Error al solicitar");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  // 5. RF-10 / RF-11: Escáner del Encargado (Procesar QR de Entrega o Devolución)
  const procesarQrEncargado = async (tipo: "ENTREGA" | "DEVOLUCION") => {
    if (!tokenInput) return;
    const endpoint = tipo === "ENTREGA" ? "entregar-qr" : "devolver-qr";

    try {
      const res = await fetch(`http://localhost:3000/implementos/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenQr: tokenInput }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(tipo === "ENTREGA" ? "¡Préstamo ENTREGADO al estudiante!" : "¡Préstamo DEVUELTO! Stock repuesto.");
        setTokenInput("");
        cargarInventario();
        cargarMisPrestamos();
      } else {
        alert(data.message || "Error al procesar el código QR.");
      }
    } catch {
      alert("Error en la comunicación con el servidor.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Rol de Prueba */}
      <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between border border-slate-200">
        <span className="text-xs font-bold text-slate-600">Simular Rol en Pantalla:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setRolUsuario("ESTUDIANTE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              rolUsuario === "ESTUDIANTE" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-200"
            }`}
          >
            👨‍🎓 Vista Estudiante
          </button>
          <button
            onClick={() => setRolUsuario("ENCARGADO")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              rolUsuario === "ENCARGADO" ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-200"
            }`}
          >
            🛡️ Vista Encargado CAU / Admin
          </button>
        </div>
      </div>

      {/* Encabezado Principal */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Módulo de Préstamo de Implementos</h1>
          <p className="text-slate-500 text-sm">
            {rolUsuario === "ESTUDIANTE"
              ? "Solicita implementos y gestiona tus devoluciones mediante QR."
              : "Administra inventario y escanea los códigos QR de entrega/devolución."}
          </p>
        </div>

        {rolUsuario === "ENCARGADO" && (
          <button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
          >
            + Nuevo Implemento
          </button>
        )}
      </div>

      {/* VISTA ESTUDIANTE */}
      {rolUsuario === "ESTUDIANTE" && (
        <div className="space-y-4">
          {/* Sub-navegación Estudiante */}
          <div className="flex gap-4 border-b">
            <button
              onClick={() => setTabEstudiante("CATALOGO")}
              className={`pb-2 text-sm font-bold border-b-2 transition ${
                tabEstudiante === "CATALOGO"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              ⚽ Catálogo Disponible
            </button>
            <button
              onClick={() => {
                setTabEstudiante("MIS_PRESTAMOS");
                cargarMisPrestamos();
              }}
              className={`pb-2 text-sm font-bold border-b-2 transition ${
                tabEstudiante === "MIS_PRESTAMOS"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              📋 Mis Préstamos Activos ({misPrestamos.length})
            </button>
          </div>

          {/* Sub-vista 1: Catálogo */}
          {tabEstudiante === "CATALOGO" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Implementos en Inventario</h2>
              {loading ? (
                <p className="text-slate-500 text-sm">Cargando...</p>
              ) : inventario.length === 0 ? (
                <p className="text-slate-500 text-sm">No hay implementos disponibles.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {inventario.map((item) => (
                    <div key={item.id} className="p-4 border rounded-xl bg-slate-50 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800">{item.nombre}</h3>
                        <p className="text-xs text-slate-500 mb-2">{item.descripcion || "Sin descripción"}</p>
                        <p className="text-xs text-slate-600">
                          Disponibles: <span className="font-bold text-blue-600">{item.stockDisponible}</span> / {item.stockTotal}
                        </p>
                      </div>
                      <button
                        disabled={item.stockDisponible <= 0}
                        onClick={() => solicitar(item.id)}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-semibold py-2 px-3 rounded-lg transition"
                      >
                        {item.stockDisponible > 0 ? "Solicitar Préstamo" : "Agotado"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub-vista 2: Mis Préstamos Activos (Generar QR de Devolución) */}
          {tabEstudiante === "MIS_PRESTAMOS" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Tus Préstamos en Curso</h2>
              {misPrestamos.length === 0 ? (
                <p className="text-slate-500 text-sm">No tienes préstamos activos en este momento.</p>
              ) : (
                <div className="space-y-3">
                  {misPrestamos.map((p) => (
                    <div key={p.id} className="p-4 border rounded-xl flex items-center justify-between bg-slate-50">
                      <div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            p.estado === "SOLICITADO" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {p.estado === "SOLICITADO" ? "PENDIENTE DE RETIRO" : "EN TU PODER"}
                        </span>
                        <h3 className="font-bold text-slate-800 mt-1">{p.implemento.nombre}</h3>
                        <p className="text-xs text-slate-500">Token: {p.tokenQr}</p>
                      </div>

                      <button
                        onClick={() =>
                          setQrModalData({
                            tokenQr: p.tokenQr,
                            titulo: p.estado === "SOLICITADO" ? "QR de Entrega" : "QR de Devolución",
                            desc:
                              p.estado === "SOLICITADO"
                                ? "Muestra este QR al encargado para reclamar el artículo."
                                : "Muestra este QR al encargado cuando vayas a devolver el artículo.",
                          })
                        }
                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1"
                      >
                        📲 Ver Código QR
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VISTA ENCARGADO / ADMIN */}
      {rolUsuario === "ENCARGADO" && (
        <div className="space-y-6">
          {/* Panel Escáner de QR */}
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-sm">
            <h2 className="text-base font-bold mb-1">📷 Procesador Escáner QR (Encargado)</h2>
            <p className="text-xs text-slate-400 mb-4">
              Escanee o pegue el token QR del estudiante para procesar la Salida o la Devolución.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="PRESTAMO-xxxxx..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
              />
              <button
                onClick={() => procesarQrEncargado("ENTREGA")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition"
              >
                Confirmar Entrega
              </button>
              <button
                onClick={() => procesarQrEncargado("DEVOLUCION")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition"
              >
                Registrar Devolución
              </button>
            </div>
          </div>

          {/* Tabla Inventario (CRUD) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b">
                  <th className="p-4">ID</th>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Stock Disp. / Total</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">
                      Cargando...
                    </td>
                  </tr>
                ) : inventario.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">
                      Sin implementos.
                    </td>
                  </tr>
                ) : (
                  inventario.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold">{item.id}</td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-800">{item.nombre}</p>
                        <p className="text-xs text-slate-400">{item.descripcion}</p>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{item.categoria}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-blue-600">{item.stockDisponible}</span> / {item.stockTotal}
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button
                          onClick={() => abrirEditar(item)}
                          className="bg-amber-500 text-white text-xs px-2.5 py-1.5 rounded"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(item.id)}
                          className="bg-red-500 text-white text-xs px-2.5 py-1.5 rounded"
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL MOSTRAR QR */}
      {qrModalData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-800">{qrModalData.titulo}</h3>
            <p className="text-xs text-slate-500 my-2">{qrModalData.desc}</p>
            <div className="bg-slate-100 p-4 rounded-xl my-2">
              <QRCodeSVG value={qrModalData.tokenQr} size={180} />
            </div>
            <p className="text-[10px] text-slate-400 font-mono break-all mb-4">{qrModalData.tokenQr}</p>
            <button
              onClick={() => setQrModalData(null)}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs py-2 rounded-lg font-bold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL FORMULARIO (Crear/Editar) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full space-y-4">
            <h2 className="text-lg font-bold text-slate-800">{editandoId ? "Editar Implemento" : "Crear Nuevo Implemento"}</h2>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nombre</label>
              <input
                required
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full border rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full border rounded p-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Stock Total</label>
                <input
                  required
                  min="1"
                  type="number"
                  value={formData.stockTotal}
                  onChange={(e) => setFormData({ ...formData, stockTotal: parseInt(e.target.value) || 1 })}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Categoría</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-slate-200 text-slate-700 px-4 py-2 rounded text-xs"
              >
                Cancelar
              </button>
              <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded text-xs font-bold">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ImplementosModule;
