import { useState } from "react";
import Swal from "sweetalert2";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.usuario || !form.password) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Ingresa usuario y contraseña",
        background: "#111827",
        color: "#f1f5f9",
        confirmButtonColor: "#2563eb"
      });
      return;
    }
    setLoading(true);
    // Simulación de autenticación (sin backend de auth real)
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    onLogin({ nombre: form.usuario, rol: "Administrador" });
  };

  return (
    <div className="cx-login-bg">
      <div className="cx-login-card cx-fade">
        <div className="cx-login-logo">
          <div style={{ marginBottom: 12 }}>
            <span className="cx-login-badge">🏗️ ERP Construcción</span>
          </div>
          <h1>Constructix</h1>
          <p>Sistema de gestión empresarial</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="cx-form-group" style={{ marginBottom: 16 }}>
            <label className="cx-form-label">Usuario</label>
            <input
              className="cx-input"
              type="text"
              placeholder="Ingresa tu usuario"
              value={form.usuario}
              onChange={e => setForm({ ...form, usuario: e.target.value })}
              autoComplete="username"
            />
          </div>

          <div className="cx-form-group" style={{ marginBottom: 24 }}>
            <label className="cx-form-label">Contraseña</label>
            <input
              className="cx-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="cx-btn cx-btn-primary cx-btn-full cx-btn-lg"
            disabled={loading}
          >
            {loading ? (
              <><span className="cx-loader" /> Verificando...</>
            ) : (
              <>🔐 Iniciar sesión</>
            )}
          </button>
        </form>


      </div>
    </div>
  );
}
