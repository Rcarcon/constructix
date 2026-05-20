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
  material_id: "", proveedor_id: "",
  cantidad: "", precio_unitario: "",
  fecha_compra: "", estado: "Registrada"
};

const ESTADOS = ["Registrada", "Pendiente", "Entregada", "Cancelada"];

function getBadge(estado) {
  const map = {
    "Entregada":  "cx-badge cx-badge-green",
    "Registrada": "cx-badge cx-badge-blue",
    "Pendiente":  "cx-badge cx-badge-amber",
    "Cancelada":  "cx-badge cx-badge-red"
  };
  return map[estado] || "cx-badge cx-badge-gray";
}

export default function Compras() {
  const [compras, setCompras]         = useState([]);
  const [materiales, setMateriales]   = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm]   = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { cargarTodo(); }, []);

  const cargarTodo = async () => {
    try {
      const [c, m, p] = await Promise.all([
        axios.get(`${API}/compras`),
        axios.get(`${API}/materiales`),
        axios.get(`${API}/proveedores`)
      ]);
      setCompras(c.data);
      setMateriales(m.data);
      setProveedores(p.data);
    } catch {
      Swal.fire({ ...SWAL_THEME, icon: "error", title: "Error", text: "No se pudo cargar datos" });
    }
  };

  const total = () => Number(form.cantidad || 0) * Number(form.precio_unitario || 0);

  const validar = () => {
    if (!form.material_id)                             return "Selecciona un material";
    if (!form.cantidad || Number(form.cantidad) <= 0)  return "La cantidad debe ser mayor a 0";
    if (!form.precio_unitario || Number(form.precio_unitario) <= 0) return "El precio debe ser mayor a 0";
    if (!form.fecha_compra)                            return "La fecha de compra es requerida";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validar();
    if (err) { Swal.fire({ ...SWAL_THEME, icon: "warning", title: "Validación", text: err }); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        total: total(),
        proveedor_id: form.proveedor_id || null
      };
      if (editId) {
        await axios.put(`${API}/compras/${editId}`, payload);
        Swal.fire({ ...SWAL_THEME, icon: "success", title: "Compra actualizada", timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(`${API}/compras`, payload);
        Swal.fire({ ...SWAL_THEME, icon: "success", title: "Compra registrada", timer: 1500, showConfirmButton: false });
      }
      resetForm();
      cargarTodo();
    } catch {
      Swal.fire({ ...SWAL_THEME, icon: "error", title: "Error", text: "No se pudo guardar" });
    } finally {
      setLoading(false);
    }
  };

  const editar = (c) => {
    setEditId(c.id);
    setForm({
      material_id:    c.material_id || "",
      proveedor_id:   c.proveedor_id || "",
      cantidad:       c.cantidad || "",
      precio_unitario: c.precio_unitario || "",
      fecha_compra:   c.fecha_compra?.split("T")[0] || "",
      estado:         c.estado || "Registrada"
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      ...SWAL_THEME,
      icon: "warning",
      title: "¿Eliminar compra?",
      text: "Esta acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#b91c1c"
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API}/compras/${id}`);
      Swal.fire({ ...SWAL_THEME, icon: "success", title: "Eliminada", timer: 1200, showConfirmButton: false });
      cargarTodo();
    } catch {
      Swal.fire({ ...SWAL_THEME, icon: "error", title: "Error", text: "No se pudo eliminar" });
    }
  };

  const resetForm = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  const getNombreMaterial  = (id) => materiales.find(m => m.id === Number(id))?.nombre || `ID:${id}`;
  const getNombreProveedor = (id) => proveedores.find(p => p.id === Number(id))?.nombre || (id ? `ID:${id}` : "—");
  const formatQ = n => "Q" + Number(n || 0).toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const filtrados = compras.filter(c => {
    const q = search.toLowerCase();
    if (!q) return true;
    return getNombreMaterial(c.material_id).toLowerCase().includes(q) ||
      getNombreProveedor(c.proveedor_id).toLowerCase().includes(q) ||
      c.estado?.toLowerCase().includes(q);
  });

  const montoTotal = compras.reduce((s, c) => s + Number(c.total || 0), 0);

  return (
    <div className="cx-page cx-fade">
      <div className="cx-page-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="cx-page-title">🛒 Compras</h1>
            <p className="cx-page-sub">{compras.length} compras · Total acumulado: {formatQ(montoTotal)}</p>
          </div>
          <button
            className={`cx-btn ${showForm ? "cx-btn-ghost" : "cx-btn-primary"}`}
            onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
          >
            {showForm ? "✕ Cancelar" : "+ Nueva Compra"}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="cx-card cx-fade" style={{ marginBottom: 24 }}>
          <div className="cx-card-header">
            <div>
              <div className="cx-card-title">{editId ? "✏️ Editar Compra" : "➕ Registrar Compra"}</div>
              <div className="cx-card-sub">Gestión de compras de materiales</div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="cx-form-grid cx-form-2col">
              <div className="cx-form-group">
                <label className="cx-form-label">Material *</label>
                <select className="cx-input" value={form.material_id}
                  onChange={e => setForm({ ...form, material_id: e.target.value })}>
                  <option value="">Seleccionar material</option>
                  {materiales.map(m => <option key={m.id} value={m.id}>{m.nombre} ({m.unidad_medida})</option>)}
                </select>
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Proveedor</label>
                <select className="cx-input" value={form.proveedor_id}
                  onChange={e => setForm({ ...form, proveedor_id: e.target.value })}>
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Cantidad *</label>
                <input className="cx-input" type="number" min="0.01" step="0.01" placeholder="0"
                  value={form.cantidad} onChange={e => setForm({ ...form, cantidad: e.target.value })} />
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Precio Unitario (Q) *</label>
                <input className="cx-input" type="number" min="0.01" step="0.01" placeholder="0.00"
                  value={form.precio_unitario} onChange={e => setForm({ ...form, precio_unitario: e.target.value })} />
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Fecha de Compra *</label>
                <input className="cx-input" type="date" value={form.fecha_compra}
                  onChange={e => setForm({ ...form, fecha_compra: e.target.value })} />
              </div>
              <div className="cx-form-group">
                <label className="cx-form-label">Estado</label>
                <select className="cx-input" value={form.estado}
                  onChange={e => setForm({ ...form, estado: e.target.value })}>
                  {ESTADOS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Total preview */}
            {form.cantidad && form.precio_unitario && (
              <div style={{
                marginTop: 16,
                padding: "12px 16px",
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <span style={{ color: "var(--text-2)", fontSize: 13 }}>Total calculado</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: "var(--blue)" }}>{formatQ(total())}</span>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
              <button type="button" className="cx-btn cx-btn-ghost" onClick={resetForm}>Cancelar</button>
              <button type="submit" className="cx-btn cx-btn-primary" disabled={loading}>
                {loading ? <><span className="cx-loader" /> Guardando...</> : (editId ? "💾 Actualizar" : "💾 Guardar")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="cx-card" style={{ marginBottom: 20 }}>
        <div className="cx-search" style={{ maxWidth: 360 }}>
          <span className="cx-search-icon">🔍</span>
          <input placeholder="Buscar material, proveedor, estado..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="cx-card">
        <div className="cx-card-header">
          <div className="cx-card-title">Historial de Compras</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-2)" }}>{filtrados.length} resultado(s)</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--blue)" }}>Total: {formatQ(montoTotal)}</span>
          </div>
        </div>
        <div className="cx-table-wrap">
          {filtrados.length === 0 ? (
            <div className="cx-empty"><div className="cx-empty-icon">🛒</div><div className="cx-empty-text">No se encontraron compras</div></div>
          ) : (
            <table className="cx-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Proveedor</th>
                  <th>Cantidad</th>
                  <th>P. Unitario</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{getNombreMaterial(c.material_id)}</td>
                    <td style={{ color: "var(--text-2)" }}>{getNombreProveedor(c.proveedor_id)}</td>
                    <td>{Number(c.cantidad).toLocaleString("es-GT")}</td>
                    <td>{formatQ(c.precio_unitario)}</td>
                    <td style={{ fontWeight: 700 }}>{formatQ(c.total)}</td>
                    <td style={{ color: "var(--text-2)", whiteSpace: "nowrap" }}>{c.fecha_compra?.substring(0, 10) || "—"}</td>
                    <td><span className={getBadge(c.estado)}>{c.estado}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="cx-btn cx-btn-warning cx-btn-sm" onClick={() => editar(c)}>✏️</button>
                        <button className="cx-btn cx-btn-danger cx-btn-sm" onClick={() => eliminar(c.id)}>🗑</button>
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
