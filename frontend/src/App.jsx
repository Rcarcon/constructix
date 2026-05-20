import { useState } from "react";
import "./index.css";

import Login      from "./components/Login";
import Sidebar    from "./components/Sidebar";
import Dashboard  from "./components/Dashboard";
import Proyectos  from "./components/Proyectos";
import Materiales from "./components/Materiales";
import Compras    from "./components/Compras";
import Avances    from "./components/Avances";

const PAGE_TITLES = {
  dashboard:    { title: "Dashboard",         sub: "Resumen ejecutivo del sistema" },
  proyectos:    { title: "Gestión de Proyectos", sub: "Administra todos tus proyectos de construcción" },
  materiales:   { title: "Inventario de Materiales", sub: "Control de stock y precios" },
  compras:      { title: "Compras de Materiales", sub: "Historial y registro de compras" },
  avances:      { title: "Avances de Obra",   sub: "Seguimiento del progreso por proyecto" },
  presupuestos: { title: "Presupuestos",       sub: "Gestión financiera de proyectos" },
  proveedores:  { title: "Proveedores",        sub: "Directorio de proveedores" },
  clientes:     { title: "Clientes",           sub: "Gestión de clientes" }
};

function PlaceholderPage({ page }) {
  const info = PAGE_TITLES[page] || {};
  return (
    <div className="cx-page cx-fade">
      <div className="cx-page-header">
        <h1 className="cx-page-title">{info.title}</h1>
        <p className="cx-page-sub">{info.sub}</p>
      </div>
      <div className="cx-card" style={{ textAlign: "center", padding: "60px 24px" }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🚧</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Módulo disponible</h2>
        <p style={{ color: "var(--text-2)", maxWidth: 380, margin: "0 auto" }}>
          Este módulo ya cuenta con endpoints backend activos en <code style={{ color: "var(--blue)" }}>/api/{page}</code>.
          El componente puede implementarse siguiendo el mismo patrón de Materiales o Proyectos.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [logueado, setLogueado]     = useState(false);
  const [user, setUser]             = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setLogueado(true);
  };

  const handleLogout = () => {
    setLogueado(false);
    setUser(null);
    setActivePage("dashboard");
  };

  const navigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  if (!logueado) return <Login onLogin={handleLogin} />;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":    return <Dashboard />;
      case "proyectos":    return <Proyectos />;
      case "materiales":   return <Materiales />;
      case "compras":      return <Compras />;
      case "avances":      return <Avances />;
      default:             return <PlaceholderPage page={activePage} />;
    }
  };

  const pageInfo = PAGE_TITLES[activePage] || {};

  return (
    <div className="cx-layout">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 199,
            display: "none"
          }}
          className="sidebar-overlay"
        />
      )}

      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        user={user}
        onLogout={handleLogout}
        open={sidebarOpen}
      />

      <div className="cx-main">
        {/* Topbar */}
        <div className="cx-topbar">
          <div>
            <div className="cx-topbar-title">{pageInfo.title}</div>
            <div className="cx-topbar-sub">{pageInfo.sub}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Fecha actual */}
            <div style={{
              fontSize: 12, color: "var(--text-2)",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              padding: "6px 12px",
              borderRadius: "var(--r-md)"
            }}>
              📅 {new Date().toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" })}
            </div>
            {/* Notif de alertas */}
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-md)",
              padding: "6px 12px",
              fontSize: 12,
              color: "var(--text-2)",
              cursor: "pointer"
            }}
              onClick={() => navigate("dashboard")}
            >
              🔔
            </div>
          </div>
        </div>

        {/* Page content */}
        {renderPage()}
      </div>
    </div>
  );
}
