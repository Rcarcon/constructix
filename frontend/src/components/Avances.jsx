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

const EMPTY = {
  proyecto_id: "", descripcion: "",
  porcentaje_avance: "", observaciones: "",
  estado: "En proceso"
};

const ESTADOS = ["En proceso", "Finalizado", "Pausado", "Cancelado"];

function getBadge(estado) {
  const map = {
    "Finalizado": "cx-badge cx-badge-green",
    "En proceso": "cx-badge cx-badge-blue",
    "Pausado":    "cx-badge cx-badge-amber",
    "Cancelado":  "cx-badge cx-badge-red"
  };
  return map[estado] || "cx-badge cx-badge-gray";
}

function ProgressBar({ pct }) {
  const p = Math.min(100, Math.max(0, Number(pct) || 0));
  const color = p >= 80 ? "#10b981" : p >= 40 ? "#3b82f6" : "#f59e0b";
  return (
    <div style={{ minWidth: 120 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11 }}>
        <span style={{ color: "var(--text-2)" }}>Avance</span>
        <span style={{ fontWeight: 700, color }}>{p}%</span>
      </div>
      <div className="cx-progress">
        <div className="cx-progress-fill" style={{ width: `${p}%`, background: color }} />
      </div>
    </div>
  );
}

export default function Avances() {
  const [avances, setAvances]     = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [form, setForm]     = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState("");
  const [filterProy, setFilterProy] = useState("Todos");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const [a, p] = await Promise.all([
        axios.get(`${API}/avances`),
        axios.get(`${API}/proyectos`)
      ]);
      setAvances(a.data);
      setProyectos(p.data);
    } catch {
      Swal.fire({ ...SWAL_THEME, icon: "error", title: "Error", text: "No se pudo cargar datos" });
    }
  };

  const validar = () => {
    if (!form.proyecto_id)                              return "Selecciona un proyecto";
    if (!form.descripcion.trim())                       return "La descripción es requerida";
    const p = Number(form.porcentaje_avance);
    if (form.porcentaje_avance === "" || p < 0 || p > 100) return "El porcentaje debe ser entre 0 y 100";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validar();
    if (err) { Swal.fire({ ...SWAL_THEME, icon: "warning", title: "Validación", text: err }); return; }
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API}/avances/${editId}`, form);
        Swal.fire({ ...SWAL_THEME, icon: "success", title: "Avance actualizado", timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(`${API}/avances`, form);
        Swal.fire({ ...SWAL_THEME, icon: "success", title: "Avance registrado", timer: 1500, showConfirmButton: false });
      }
      resetForm();
      cargar();
    } catch {
      Swal.fire({ ...SWAL_THEME, icon: "error", title: "Error", text: "No se pudo guardar" });
    } finally {
      setLoading(false);
    }
  };

  const editar = (a) => {
    setEditId(a.id);
    setForm({
      proyecto_id:       a.proyecto_id || "",
      descripcion:       a.descripcion || "",
      porcentaje_avance: a.porcentaje_avance || "",
      observaciones:     a.observaciones || "",
      estado:            a.estado || "En proceso"
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      ...SWAL_THEME,
      icon: "warning",
      title: "¿Eliminar avance?",
      text: "Esta acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#b91c1c"
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API}/avances/${id}`);
      Swal.fire({ ...SWAL_THEME, icon: "success", title: "Eliminado", timer: 1200, showConfirmButton: false });
      cargar();
    } catch {
      Swal.fire({ ...SWAL_THEME, icon: "error", title: "Error", text: "No se pudo eliminar" });
    }
  };

  const resetForm = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  const getNombreProyecto = (id) => proyectos.find(p => p.id === Number(id))?.nombre || `ID:${id}`;

  const promedioGeneral = avances.length
    ? (avances.reduce((s, a) => s + Number(a.porcentaje_avance), 0) / avances.length).toFixed(1)
    : 0;

  const filtrados = avances.filter(a => {
    const matchProy = filterProy === "Todos" || String(a.proyecto_id) === filterProy;
    const q = search.toLowerCase();
    const matchSearch = !q || a.descripcion?.toLowerCase().includes(q) ||
      getNombreProyecto(a.proyecto_id).toLowerCase().includes(q);
    return matchProy && matchSearch;
  });

  return (
    <div className="cx-page cx-fade">
      <div className="cx-page-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="cx-page-title">📈 Avances de Obra</h1>
            <p className="cx-page-sub">{avances.length} registros · Avance promedio: {promedioGeneral}%</p>
          </div>
          <button
            className={`cx-btn ${showForm ? "cx-btn-ghost" : "cx-btn-primary"}`}
            onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
          >
            {showForm ? "✕ Cancelar" : "+ Nuevo Avance"}
          </button>
        </div>
      </div>

      {/* Progreso general */}
      <div className="cx-card" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>Avance General Promedio</span>
          <span style={{ fontWeight: 800, fontSize: 18, color: Number(promedioGeneral) >= 80 ? "var(--green)" : "var(--blue)" }}>
            {promedioGeneral}%
          </span>
        </div>
        <div className="cx-progress" style={{ height: 10 }}>
          <div className="cx-progress-fill" style={{
            width: `${promedioGeneral}%`,
            background: Number(promedioGeneral) >= 80 ? "#10b981" : "#3b82f6"
          }} />
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="cx-card cx-fade" style={{ marginBottom: 24 }}>
          <div className="cx-card-header">
            <div>
              <div className="cx-card-title">{editId ? "✏️ Editar Avance" : "➕ Registrar Avance"}</div>
              <div className="cx-card-sub">Seguimiento de progreso de obra</div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="cx-form-grid cx-form-2col">
              <div className="cx-form-group">
                <label className="cx-form-label">Proyecto *</label>
                <select className="cx-input" value={form.proyecto_id}
                  onChange={e => setForm({ ...form, proyecto_id: e.target.value })}>
                  <option value="">Seleccionar proyecto</option>
                  {proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Estado</label>
                <select className="cx-input" value={form.estado}
                  onChange={e => setForm({ ...form, estado: e.target.value })}>
                  {ESTADOS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="cx-form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="cx-form-label">Descripción *</label>
                <input className="cx-input" type="text" placeholder="Describe el avance realizado"
                  value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Porcentaje de Avance (0–100) *</label>
                <input className="cx-input" type="number" min="0" max="100" placeholder="0"
                  value={form.porcentaje_avance}
                  onChange={e => setForm({ ...form, porcentaje_avance: e.target.value })} />
                {form.porcentaje_avance !== "" && (
                  <div style={{ marginTop: 8 }}>
                    <ProgressBar pct={form.porcentaje_avance} />
                  </div>
                )}
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Observaciones</label>
                <input className="cx-input" type="text" placeholder="Observaciones adicionales"
                  value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} />
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

      {/* Filters */}
      <div className="cx-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div className="cx-filters">
            <button className={`cx-filter-btn${filterProy === "Todos" ? " active" : ""}`} onClick={() => setFilterProy("Todos")}>
              Todos los proyectos
            </button>
            {proyectos.slice(0, 5).map(p => (
              <button key={p.id}
                className={`cx-filter-btn${filterProy === String(p.id) ? " active" : ""}`}
                onClick={() => setFilterProy(String(p.id))}>
                {p.nombre.length > 18 ? p.nombre.substring(0, 18) + "…" : p.nombre}
              </button>
            ))}
          </div>
          <div className="cx-search">
            <span className="cx-search-icon">🔍</span>
            <input placeholder="Buscar descripción, proyecto..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="cx-card">
        <div className="cx-card-header">
          <div className="cx-card-title">Registro de Avances</div>
          <span style={{ fontSize: 12, color: "var(--text-2)" }}>{filtrados.length} resultado(s)</span>
        </div>
        <div className="cx-table-wrap">
          {filtrados.length === 0 ? (
            <div className="cx-empty"><div className="cx-empty-icon">📈</div><div className="cx-empty-text">No se encontraron avances</div></div>
          ) : (
            <table className="cx-table">
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Descripción</th>
                  <th>Avance</th>
                  <th>Observaciones</th>
                  <th>Fecha Reg.</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{getNombreProyecto(a.proyecto_id)}</td>
                    <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.descripcion}
                    </td>
                    <td style={{ minWidth: 140 }}>
                      <ProgressBar pct={a.porcentaje_avance} />
                    </td>
                    <td style={{ color: "var(--text-2)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.observaciones || "—"}
                    </td>
                    <td style={{ color: "var(--text-2)", whiteSpace: "nowrap" }}>
                      {a.fecha_registro?.substring(0, 10) || "—"}
                    </td>
                    <td><span className={getBadge(a.estado)}>{a.estado}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="cx-btn cx-btn-warning cx-btn-sm" onClick={() => editar(a)}>✏️</button>
                        <button className="cx-btn cx-btn-danger cx-btn-sm" onClick={() => eliminar(a.id)}>🗑</button>
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
