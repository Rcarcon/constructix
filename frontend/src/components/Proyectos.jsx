import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API = "http://localhost:3000/api";

const SWAL_THEME = {
  background: "#111827",
  color: "#f1f5f9",
  confirmButtonColor: "#2563eb",
  cancelButtonColor: "#374151"
};

const ESTADOS = ["Planificado", "En progreso", "En ejecución", "Pausado", "Finalizado", "Cancelado"];

const EMPTY = {
  nombre: "", cliente: "", ubicacion: "",
  fecha_inicio: "", fecha_fin_estimada: "",
  presupuesto_estimado: "", estado: "Planificado"
};

function getBadge(estado) {
  const map = {
    "Finalizado":    "cx-badge cx-badge-green",
    "En progreso":   "cx-badge cx-badge-blue",
    "En ejecución":  "cx-badge cx-badge-blue",
    "Planificado":   "cx-badge cx-badge-amber",
    "Pausado":       "cx-badge cx-badge-purple",
    "Cancelado":     "cx-badge cx-badge-red"
  };
  return map[estado] || "cx-badge cx-badge-gray";
}

function isAtrasado(proyecto) {
  if (!proyecto.fecha_fin_estimada) return false;
  if (["Finalizado", "Cancelado"].includes(proyecto.estado)) return false;
  return new Date(proyecto.fecha_fin_estimada) < new Date();
}

export default function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const res = await axios.get(`${API}/proyectos`);
      setProyectos(res.data);
    } catch {
      Swal.fire({ ...SWAL_THEME, icon: "error", title: "Error", text: "No se pudo cargar proyectos" });
    }
  };

  const validar = () => {
    if (!form.nombre.trim())               return "El nombre es requerido";
    if (!form.cliente.trim())              return "El cliente es requerido";
    if (!form.fecha_inicio)                return "La fecha de inicio es requerida";
    if (!form.presupuesto_estimado || Number(form.presupuesto_estimado) <= 0)
                                            return "El presupuesto debe ser mayor a 0";
    if (form.fecha_fin_estimada && form.fecha_fin_estimada < form.fecha_inicio)
                                            return "La fecha de fin no puede ser anterior al inicio";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validar();
    if (error) {
      Swal.fire({ ...SWAL_THEME, icon: "warning", title: "Validación", text: error });
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, fecha_fin_estimada: form.fecha_fin_estimada || null };
      if (editId) {
        await axios.put(`${API}/proyectos/${editId}`, payload);
        Swal.fire({ ...SWAL_THEME, icon: "success", title: "Proyecto actualizado", timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(`${API}/proyectos`, payload);
        Swal.fire({ ...SWAL_THEME, icon: "success", title: "Proyecto creado", timer: 1500, showConfirmButton: false });
      }
      resetForm();
      cargar();
    } catch {
      Swal.fire({ ...SWAL_THEME, icon: "error", title: "Error", text: "No se pudo guardar el proyecto" });
    } finally {
      setLoading(false);
    }
  };

  const editar = (p) => {
    setEditId(p.id);
    setForm({
      nombre: p.nombre || "",
      cliente: p.cliente || "",
      ubicacion: p.ubicacion || "",
      fecha_inicio: p.fecha_inicio?.split("T")[0] || "",
      fecha_fin_estimada: p.fecha_fin_estimada?.split("T")[0] || "",
      presupuesto_estimado: p.presupuesto_estimado || "",
      estado: p.estado || "Planificado"
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = async (id, nombre) => {
    const result = await Swal.fire({
      ...SWAL_THEME,
      icon: "warning",
      title: "¿Eliminar proyecto?",
      html: `<span style="color:#94a3b8">Se eliminará permanentemente:<br><strong style="color:#f1f5f9">${nombre}</strong></span>`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#b91c1c"
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API}/proyectos/${id}`);
      Swal.fire({ ...SWAL_THEME, icon: "success", title: "Eliminado", timer: 1200, showConfirmButton: false });
      cargar();
    } catch {
      Swal.fire({ ...SWAL_THEME, icon: "error", title: "Error", text: "No se pudo eliminar" });
    }
  };

  const resetForm = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  const filtrados = proyectos.filter(p => {
    const matchFilter = filter === "Todos" || p.estado === filter ||
      (filter === "Atrasados" && isAtrasado(p));
    const q = search.toLowerCase();
    const matchSearch = !q || p.nombre?.toLowerCase().includes(q) ||
      p.cliente?.toLowerCase().includes(q) || p.ubicacion?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const formatQ = n => "Q" + Number(n || 0).toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="cx-page cx-fade">
      <div className="cx-page-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="cx-page-title">🏗️ Proyectos</h1>
            <p className="cx-page-sub">{proyectos.length} proyectos registrados</p>
          </div>
          <button
            className={`cx-btn ${showForm ? "cx-btn-ghost" : "cx-btn-primary"}`}
            onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
          >
            {showForm ? "✕ Cancelar" : "+ Nuevo Proyecto"}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="cx-card cx-fade" style={{ marginBottom: 24 }}>
          <div className="cx-card-header">
            <div>
              <div className="cx-card-title">{editId ? "✏️ Editar Proyecto" : "➕ Nuevo Proyecto"}</div>
              <div className="cx-card-sub">{editId ? "Modifica los datos del proyecto" : "Registra un nuevo proyecto"}</div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="cx-form-grid cx-form-2col">
              <div className="cx-form-group">
                <label className="cx-form-label">Nombre del Proyecto *</label>
                <input className="cx-input" type="text" placeholder="Ej: Torre Residencial Norte"
                  value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Cliente *</label>
                <input className="cx-input" type="text" placeholder="Nombre del cliente"
                  value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} />
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Ubicación</label>
                <input className="cx-input" type="text" placeholder="Ciudad, Departamento"
                  value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })} />
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Estado</label>
                <select className="cx-input" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
                  {ESTADOS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Fecha de Inicio *</label>
                <input className="cx-input" type="date" value={form.fecha_inicio}
                  onChange={e => setForm({ ...form, fecha_inicio: e.target.value })} />
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Fecha Fin Estimada</label>
                <input className="cx-input" type="date" value={form.fecha_fin_estimada}
                  onChange={e => setForm({ ...form, fecha_fin_estimada: e.target.value })} />
              </div>
              <div className="cx-form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="cx-form-label">Presupuesto Estimado (Q) *</label>
                <input className="cx-input" type="number" min="0" step="0.01" placeholder="0.00"
                  value={form.presupuesto_estimado}
                  onChange={e => setForm({ ...form, presupuesto_estimado: e.target.value })} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
              <button type="button" className="cx-btn cx-btn-ghost" onClick={resetForm}>Cancelar</button>
              <button type="submit" className="cx-btn cx-btn-primary" disabled={loading}>
                {loading ? <><span className="cx-loader" /> Guardando...</> : (editId ? "💾 Actualizar" : "💾 Guardar")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters + Search */}
      <div className="cx-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div className="cx-filters">
            {["Todos", ...ESTADOS, "Atrasados"].map(f => (
              <button key={f} className={`cx-filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          <div className="cx-search">
            <span className="cx-search-icon">🔍</span>
            <input placeholder="Buscar proyecto, cliente..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="cx-card">
        <div className="cx-card-header">
          <div className="cx-card-title">Listado de Proyectos</div>
          <span style={{ fontSize: 12, color: "var(--text-2)" }}>{filtrados.length} resultado(s)</span>
        </div>
        <div className="cx-table-wrap">
          {filtrados.length === 0 ? (
            <div className="cx-empty"><div className="cx-empty-icon">🏗️</div><div className="cx-empty-text">No se encontraron proyectos</div></div>
          ) : (
            <table className="cx-table">
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Cliente</th>
                  <th>Ubicación</th>
                  <th>Inicio</th>
                  <th>Fin Est.</th>
                  <th>Presupuesto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.nombre}</div>
                      {isAtrasado(p) && (
                        <div style={{ fontSize: 11, color: "var(--red)", marginTop: 2 }}>⚠ Atrasado</div>
                      )}
                    </td>
                    <td>{p.cliente}</td>
                    <td style={{ color: "var(--text-2)" }}>{p.ubicacion || "—"}</td>
                    <td style={{ color: "var(--text-2)", whiteSpace: "nowrap" }}>{p.fecha_inicio?.substring(0, 10) || "—"}</td>
                    <td style={{ color: isAtrasado(p) ? "var(--red)" : "var(--text-2)", whiteSpace: "nowrap" }}>
                      {p.fecha_fin_estimada?.substring(0, 10) || "—"}
                    </td>
                    <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{formatQ(p.presupuesto_estimado)}</td>
                    <td><span className={getBadge(p.estado)}>{p.estado}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="cx-btn cx-btn-warning cx-btn-sm" onClick={() => editar(p)}>✏️ Editar</button>
                        <button className="cx-btn cx-btn-danger cx-btn-sm" onClick={() => eliminar(p.id, p.nombre)}>🗑 Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
