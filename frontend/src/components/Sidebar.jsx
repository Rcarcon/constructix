const NAV = [
  {
    section: "Principal",
    items: [
      { id: "dashboard",    icon: "📊", label: "Dashboard" },
    ]
  },
  {
    section: "Gestión",
    items: [
      { id: "proyectos",    icon: "🏗️",  label: "Proyectos" },
      { id: "materiales",   icon: "🧱",  label: "Materiales" },
      { id: "compras",      icon: "🛒",  label: "Compras" },
      { id: "avances",      icon: "📈",  label: "Avances de Obra" },
    ]
  },
  {
    section: "Administración",
    items: [
      { id: "presupuestos", icon: "💰",  label: "Presupuestos" },
      { id: "proveedores",  icon: "🏭",  label: "Proveedores" },
      { id: "clientes",     icon: "👥",  label: "Clientes" },
    ]
  }
];

export default function Sidebar({ activePage, onNavigate, user, onLogout, open }) {
  return (
    <aside className={`cx-sidebar${open ? " open" : ""}`}>
      {/* Logo */}
      <div className="cx-sidebar-logo">
        <h1>Constructix</h1>
        <p>ERP Construcción v2.0</p>
      </div>

      {/* Nav */}
      <nav className="cx-nav">
        {NAV.map(group => (
          <div key={group.section}>
            <div className="cx-nav-section">{group.section}</div>
            {group.items.map(item => (
              <div
                key={item.id}
                className={`cx-nav-item${activePage === item.id ? " active" : ""}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="cx-nav-icon">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="cx-sidebar-footer">
        <div className="cx-user-card">
          <div className="cx-avatar">
            {(user?.nombre?.[0] || "A").toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="cx-user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.nombre || "Admin"}
            </div>
            <div className="cx-user-role">{user?.rol || "Administrador"}</div>
          </div>
          <button
            className="cx-logout-btn"
            onClick={onLogout}
            title="Cerrar sesión"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
