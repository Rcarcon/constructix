import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend, Filler
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

const API = "http://localhost:3000/api";

const CHART_OPTS_BASE = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#94a3b8", font: { size: 12 }, boxWidth: 12 } }
  },
  scales: {
    x: { ticks: { color: "#94a3b8", font: { size: 11 } }, grid: { color: "rgba(26,39,69,0.8)" } },
    y: { ticks: { color: "#94a3b8", font: { size: 11 } }, grid: { color: "rgba(26,39,69,0.8)" } }
  }
};

function formatQ(n) {
  return "Q" + Number(n || 0).toLocaleString("es-GT", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function KPICard({ icon, value, label, sub, color, bg }) {
  return (
    <div className="cx-kpi cx-fade" style={{ "--kpi-color": color, "--kpi-bg": bg }}>
      <div className="cx-kpi-icon">{icon}</div>
      <div className="cx-kpi-val" style={{ color }}>{value}</div>
      <div className="cx-kpi-lbl">{label}</div>
      {sub && <div className="cx-kpi-sub">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await axios.get(`${API}/dashboard`);
      setKpis(res.data);
    } catch (e) {
      setErr("No se pudo conectar con el servidor. Verifica que el backend esté activo.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12 }}>
      <div className="cx-loader" />
      <span style={{ color: "var(--text-2)" }}>Cargando dashboard...</span>
    </div>
  );

  if (err) return (
    <div className="cx-alert cx-alert-red" style={{ maxWidth: 500, margin: "40px auto" }}>
      <span className="cx-alert-icon">⚠️</span>
      <div><div className="cx-alert-title">Error de conexión</div><div className="cx-alert-desc">{err}</div></div>
    </div>
  );

  const p = kpis.proyectos;
  const c = kpis.compras;
  const ms = kpis.materiales_stock;

  // -- Alertas empresariales --
  const alertas = [];
  if (ms?.critico > 0)
    alertas.push({ tipo: "red", icon: "🚨", title: `${ms.critico} material(es) en estado crítico`, desc: "Stock ≤ 5 unidades. Requiere compra urgente." });
  if (ms?.total_bajo > 0)
    alertas.push({ tipo: "amber", icon: "⚠️", title: `${ms.total_bajo} material(es) con stock bajo`, desc: "Stock ≤ 10 unidades. Revisar inventario." });
  if (p?.atrasados > 0)
    alertas.push({ tipo: "red", icon: "🕐", title: `${p.atrasados} proyecto(s) atrasados`, desc: "Fecha estimada de fin superada sin finalizar." });
  if (Number(c?.monto_mes || 0) > 50000)
    alertas.push({ tipo: "amber", icon: "💸", title: "Alto gasto en compras este mes", desc: `${formatQ(c.monto_mes)} en los últimos 30 días.` });
  if (alertas.length === 0)
    alertas.push({ tipo: "green", icon: "✅", title: "Sin alertas activas", desc: "Todos los indicadores están en orden." });

  // -- Gráfica: avance por proyecto --
  const grafAvance = {
    labels: kpis.grafica_avance.labels,
    datasets: [{
      label: "% Avance",
      data: kpis.grafica_avance.data,
      backgroundColor: kpis.grafica_avance.data.map(v =>
        v >= 80 ? "rgba(16,185,129,0.7)" : v >= 40 ? "rgba(59,130,246,0.7)" : "rgba(245,158,11,0.7)"
      ),
      borderRadius: 6,
      borderSkipped: false
    }]
  };

  // -- Gráfica: compras por mes --
  const grafCompras = {
    labels: kpis.grafica_compras_mes.labels.length ? kpis.grafica_compras_mes.labels : ["Sin datos"],
    datasets: [{
      label: "Monto (Q)",
      data: kpis.grafica_compras_mes.data.length ? kpis.grafica_compras_mes.data : [0],
      fill: true,
      backgroundColor: "rgba(59,130,246,0.1)",
      borderColor: "#3b82f6",
      tension: 0.4,
      pointBackgroundColor: "#3b82f6",
      pointRadius: 4
    }]
  };

  // -- Gráfica: materiales top --
  const grafMateriales = {
    labels: kpis.grafica_materiales.labels.length ? kpis.grafica_materiales.labels : ["Sin datos"],
    datasets: [{
      label: "Cantidad comprada",
      data: kpis.grafica_materiales.data.length ? kpis.grafica_materiales.data : [0],
      backgroundColor: [
        "rgba(59,130,246,0.75)", "rgba(16,185,129,0.75)", "rgba(245,158,11,0.75)",
        "rgba(139,92,246,0.75)", "rgba(239,68,68,0.75)", "rgba(6,182,212,0.75)"
      ],
      borderWidth: 0
    }]
  };

  // -- Gráfica: resumen general --
  const grafResumen = {
    labels: ["Proyectos", "Finalizados", "En Progreso", "Planificados"],
    datasets: [{
      data: [p.total, p.finalizados, p.en_progreso, p.planificados],
      backgroundColor: ["rgba(59,130,246,0.75)","rgba(16,185,129,0.75)","rgba(245,158,11,0.75)","rgba(139,92,246,0.75)"],
      borderWidth: 0,
      hoverOffset: 6
    }]
  };

  return (
    <div className="cx-page cx-fade">
      {/* Header */}
      <div className="cx-page-header">
        <h1 className="cx-page-title">Dashboard Empresarial</h1>
        <p className="cx-page-sub">Resumen ejecutivo del sistema · Actualizado en tiempo real</p>
      </div>

      {/* KPIs */}
      <div className="cx-kpi-grid">
        <KPICard icon="🏗️" value={p.total} label="Total Proyectos" sub={`${p.finalizados} finalizados`} color="#3b82f6" bg="rgba(59,130,246,0.1)" />
        <KPICard icon="✅" value={p.finalizados} label="Finalizados" sub={`${p.planificados} planificados`} color="#10b981" bg="rgba(16,185,129,0.1)" />
        <KPICard icon="⏳" value={p.atrasados} label="Proyectos Atrasados" sub="Fecha vencida" color={p.atrasados > 0 ? "#ef4444" : "#94a3b8"} bg={p.atrasados > 0 ? "rgba(239,68,68,0.1)" : "rgba(100,116,139,0.1)"} />
        <KPICard icon="🛒" value={c.total_compras} label="Total Compras" sub={`Mes: ${formatQ(c.monto_mes)}`} color="#f59e0b" bg="rgba(245,158,11,0.1)" />
        <KPICard icon="💰" value={formatQ(c.monto_total)} label="Gasto Total" sub="Todas las compras" color="#8b5cf6" bg="rgba(139,92,246,0.1)" />
        <KPICard icon="📈" value={`${kpis.avance_promedio}%`} label="Avance Promedio" sub="General de obra" color="#06b6d4" bg="rgba(6,182,212,0.1)" />
        <KPICard icon="📦" value={ms.total_bajo} label="Stock Bajo" sub={`${ms.critico} crítico(s)`} color={ms.total_bajo > 0 ? "#ef4444" : "#10b981"} bg={ms.total_bajo > 0 ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)"} />
        <KPICard
          icon="🏆"
          value={kpis.proyecto_mayor?.nombre?.substring(0,14) + (kpis.proyecto_mayor?.nombre?.length > 14 ? "…" : "") || "—"}
          label="Mayor Presupuesto"
          sub={kpis.proyecto_mayor ? formatQ(kpis.proyecto_mayor.presupuesto_estimado) : "Sin datos"}
          color="#f59e0b"
          bg="rgba(245,158,11,0.1)"
        />
      </div>

      {/* Alertas */}
      <div className="cx-page-header" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>⚡ Alertas del Sistema</h2>
      </div>
      <div className="cx-alerts-grid" style={{ marginBottom: 28 }}>
        {alertas.map((a, i) => (
          <div key={i} className={`cx-alert cx-alert-${a.tipo}`}>
            <span className="cx-alert-icon">{a.icon}</span>
            <div>
              <div className="cx-alert-title">{a.title}</div>
              <div className="cx-alert-desc">{a.desc}</div>
            </div>
          </div>
        ))}
        {kpis.proyectos_atrasados.map(proy => (
          <div key={proy.id} className="cx-alert cx-alert-amber">
            <span className="cx-alert-icon">🕐</span>
            <div>
              <div className="cx-alert-title">{proy.nombre}</div>
              <div className="cx-alert-desc">Fin estimado: {proy.fecha_fin_estimada?.substring(0,10)} · Estado: {proy.estado}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div className="cx-page-header" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>📊 Análisis Empresarial</h2>
      </div>
      <div className="cx-charts-grid">
        {/* Avance por proyecto */}
        <div className="cx-card">
          <div className="cx-card-header">
            <div>
              <div className="cx-card-title">Avance por Proyecto</div>
              <div className="cx-card-sub">Último porcentaje registrado</div>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <Bar
              data={grafAvance}
              options={{
                ...CHART_OPTS_BASE,
                scales: {
                  ...CHART_OPTS_BASE.scales,
                  y: { ...CHART_OPTS_BASE.scales.y, min: 0, max: 100, ticks: { color: "#94a3b8", callback: v => v + "%" } }
                }
              }}
            />
          </div>
        </div>

        {/* Compras por mes */}
        <div className="cx-card">
          <div className="cx-card-header">
            <div>
              <div className="cx-card-title">Tendencia de Compras</div>
              <div className="cx-card-sub">Últimos 6 meses (Q)</div>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <Line
              data={grafCompras}
              options={{
                ...CHART_OPTS_BASE,
                scales: {
                  ...CHART_OPTS_BASE.scales,
                  y: { ...CHART_OPTS_BASE.scales.y, ticks: { color: "#94a3b8", callback: v => "Q" + v.toLocaleString() } }
                }
              }}
            />
          </div>
        </div>

        {/* Top materiales */}
        <div className="cx-card">
          <div className="cx-card-header">
            <div>
              <div className="cx-card-title">Materiales más Comprados</div>
              <div className="cx-card-sub">Top 6 por cantidad</div>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <Bar
              data={grafMateriales}
              options={{ ...CHART_OPTS_BASE, indexAxis: "y" }}
            />
          </div>
        </div>

        {/* Distribución proyectos */}
        <div className="cx-card">
          <div className="cx-card-header">
            <div>
              <div className="cx-card-title">Distribución de Proyectos</div>
              <div className="cx-card-sub">Por estado actual</div>
            </div>
          </div>
          <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ maxWidth: 240, width: "100%" }}>
              <Doughnut
                data={grafResumen}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom", labels: { color: "#94a3b8", font: { size: 11 }, boxWidth: 10, padding: 12 } }
                  },
                  cutout: "65%"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Material más usado */}
      {kpis.material_top && (
        <div className="cx-card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 36 }}>🧱</div>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Material más utilizado</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{kpis.material_top.nombre}</div>
              <div style={{ color: "var(--text-2)", fontSize: 13 }}>{kpis.material_top.total_qty} unidades en compras totales</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
