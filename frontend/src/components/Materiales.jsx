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

const UNIDADES = ["m²", "m³", "ml", "kg", "ton", "unidad", "saco", "galón", "litro", "pieza", "caja", "rollo", "plancha"];

const EMPTY = {
  nombre: "", descripcion: "", unidad_medida: "",
  precio_unitario: "", stock: "", proveedor: ""
};

const STOCK_CRITICO = 5;
const STOCK_BAJO    = 10;

function StockBadge({ stock }) {
  const s = Number(stock);
  if (s <= STOCK_CRITICO) return (
    <div>
      <span className="cx-badge cx-badge-red">🚨 Crítico: {s}</span>
    </div>
  );
  if (s <= STOCK_BAJO) return (
    <div>
      <span className="cx-badge cx-badge-amber">⚠ Bajo: {s}</span>
    </div>
  );
  return <span className="cx-badge cx-badge-green">{s}</span>;
}

export default function Materiales() {
  const [materiales, setMateriales] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const res = await axios.get(`${API}/materiales`);
      setMateriales(res.data);
    } catch {
      Swal.fire({ ...SWAL_THEME, icon: "error", title: "Error", text: "No se pudo cargar materiales" });
    }
  };

  const validar = () => {
    if (!form.nombre.trim())                           return "El nombre es requerido";
    if (!form.unidad_medida)                           return "La unidad de medida es requerida";
    if (!form.precio_unitario || Number(form.precio_unitario) < 0) return "El precio debe ser ≥ 0";
    if (form.stock === "" || Number(form.stock) < 0)   return "El stock debe ser ≥ 0";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validar();
    if (err) { Swal.fire({ ...SWAL_THEME, icon: "warning", title: "Validación", text: err }); return; }
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API}/materiales/${editId}`, form);
        Swal.fire({ ...SWAL_THEME, icon: "success", title: "Material actualizado", timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(`${API}/materiales`, form);
        Swal.fire({ ...SWAL_THEME, icon: "success", title: "Material registrado", timer: 1500, showConfirmButton: false });
      }
      resetForm();
      cargar();
    } catch {
      Swal.fire({ ...SWAL_THEME, icon: "error", title: "Error", text: "No se pudo guardar" });
    } finally {
      setLoading(false);
    }
  };

  const editar = (m) => {
    setEditId(m.id);
    setForm({
      nombre: m.nombre || "",
      descripcion: m.descripcion || "",
      unidad_medida: m.unidad_medida || "",
      precio_unitario: m.precio_unitario || "",
      stock: m.stock || "",
      proveedor: m.proveedor || ""
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = async (id, nombre) => {
    const result = await Swal.fire({
      ...SWAL_THEME,
      icon: "warning",
      title: "¿Eliminar material?",
      html: `<span style="color:#94a3b8">Esto eliminará permanentemente:<br><strong style="color:#f1f5f9">${nombre}</strong></span>`,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#b91c1c"
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API}/materiales/${id}`);
      Swal.fire({ ...SWAL_THEME, icon: "success", title: "Eliminado", timer: 1200, showConfirmButton: false });
      cargar();
    } catch {
      Swal.fire({ ...SWAL_THEME, icon: "error", title: "Error", text: "No se pudo eliminar" });
    }
  };

  const resetForm = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  const bajosStock = materiales.filter(m => Number(m.stock) <= STOCK_BAJO).length;
  const criticos   = materiales.filter(m => Number(m.stock) <= STOCK_CRITICO).length;

  const filtrados = materiales.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.nombre?.toLowerCase().includes(q) ||
      m.descripcion?.toLowerCase().includes(q) || m.proveedor?.toLowerCase().includes(q);
    const s = Number(m.stock);
    const matchFilter =
      filter === "Todos" ? true :
      filter === "Stock OK"      ? s > STOCK_BAJO :
      filter === "Stock Bajo"    ? (s <= STOCK_BAJO && s > STOCK_CRITICO) :
      filter === "Stock Crítico" ? s <= STOCK_CRITICO : true;
    return matchSearch && matchFilter;
  });

  const formatQ = n => "Q" + Number(n || 0).toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="cx-page cx-fade">
      <div className="cx-page-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="cx-page-title">🧱 Materiales</h1>
            <p className="cx-page-sub">{materiales.length} materiales · {bajosStock} con stock bajo · {criticos} críticos</p>
          </div>
          <button
            className={`cx-btn ${showForm ? "cx-btn-ghost" : "cx-btn-primary"}`}
            onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
          >
            {showForm ? "✕ Cancelar" : "+ Nuevo Material"}
          </button>
        </div>
      </div>

      {/* Alertas stock */}
      {(criticos > 0 || bajosStock > 0) && (
        <div className="cx-alerts-grid" style={{ marginBottom: 20 }}>
          {criticos > 0 && (
            <div className="cx-alert cx-alert-red">
              <span className="cx-alert-icon">🚨</span>
              <div>
                <div className="cx-alert-title">{criticos} material(es) en estado crítico</div>
                <div className="cx-alert-desc">Stock ≤ {STOCK_CRITICO} unidades. Compra urgente requerida.</div>
              </div>
            </div>
          )}
          {bajosStock > criticos && (
            <div className="cx-alert cx-alert-amber">
              <span className="cx-alert-icon">⚠️</span>
              <div>
                <div className="cx-alert-title">{bajosStock - criticos} material(es) con stock bajo</div>
                <div className="cx-alert-desc">Stock entre {STOCK_CRITICO + 1}–{STOCK_BAJO} unidades. Revisar inventario.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="cx-card cx-fade" style={{ marginBottom: 24 }}>
          <div className="cx-card-header">
            <div>
              <div className="cx-card-title">{editId ? "✏️ Editar Material" : "➕ Nuevo Material"}</div>
              <div className="cx-card-sub">Gestión del inventario de materiales</div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="cx-form-grid cx-form-2col">
              <div className="cx-form-group">
                <label className="cx-form-label">Nombre *</label>
                <input className="cx-input" type="text" placeholder="Ej: Cemento Portland"
                  value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Descripción</label>
                <input className="cx-input" type="text" placeholder="Descripción breve"
                  value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Unidad de Medida *</label>
                <select className="cx-input" value={form.unidad_medida} onChange={e => setForm({ ...form, unidad_medida: e.target.value })}>
                  <option value="">Seleccionar</option>
                  {UNIDADES.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Precio Unitario (Q) *</label>
                <input className="cx-input" type="number" min="0" step="0.01" placeholder="0.00"
                  value={form.precio_unitario} onChange={e => setForm({ ...form, precio_unitario: e.target.value })} />
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Stock Actual *</label>
                <input className="cx-input" type="number" min="0" placeholder="0"
                  value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Proveedor</label>
                <input className="cx-input" type="text" placeholder="Nombre del proveedor"
                  value={form.proveedor} onChange={e => setForm({ ...form, proveedor: e.target.value })} />
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
            {["Todos", "Stock OK", "Stock Bajo", "Stock Crítico"].map(f => (
              <button key={f} className={`cx-filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          <div className="cx-search">
            <span className="cx-search-icon">🔍</span>
            <input placeholder="Buscar nombre, proveedor..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="cx-card">
        <div className="cx-card-header">
          <div className="cx-card-title">Inventario de Materiales</div>
          <span style={{ fontSize: 12, color: "var(--text-2)" }}>{filtrados.length} resultado(s)</span>
        </div>
        <div className="cx-table-wrap">
          {filtrados.length === 0 ? (
            <div className="cx-empty"><div className="cx-empty-icon">🧱</div><div className="cx-empty-text">No se encontraron materiales</div></div>
          ) : (
            <table className="cx-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Descripción</th>
                  <th>Unidad</th>
                  <th>Precio Unit.</th>
                  <th>Stock</th>
                  <th>Proveedor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(m => (
                  <tr key={m.id}>
                    <td><span style={{ fontWeight: 600 }}>{m.nombre}</span></td>
                    <td style={{ color: "var(--text-2)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {m.descripcion || "—"}
                    </td>
                    <td><span className="cx-badge cx-badge-blue">{m.unidad_medida}</span></td>
                    <td style={{ fontWeight: 600 }}>{formatQ(m.precio_unitario)}</td>
                    <td><StockBadge stock={m.stock} /></td>
                    <td style={{ color: "var(--text-2)" }}>{m.proveedor || "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="cx-btn cx-btn-warning cx-btn-sm" onClick={() => editar(m)}>✏️ Editar</button>
                        <button className="cx-btn cx-btn-danger cx-btn-sm" onClick={() => eliminar(m.id, m.nombre)}>🗑 Eliminar</button>
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
