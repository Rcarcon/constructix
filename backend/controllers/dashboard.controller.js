const pool = require("../config/db");

exports.obtenerKPIs = async (req, res) => {
  try {
    const [
      resumenProyectos,
      resumenCompras,
      materialMasUsado,
      proyectoMayorPresupuesto,
      avancePromedio,
      materialesBajoStock,
      proyectosAtrasados,
      comprasPorMes,
      avancePorProyecto,
      compraPorMaterial
    ] = await Promise.all([
      // Proyectos por estado
      pool.query(`
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE estado = 'Finalizado') AS finalizados,
          COUNT(*) FILTER (WHERE estado = 'En progreso' OR estado = 'En ejecución') AS en_progreso,
          COUNT(*) FILTER (WHERE estado = 'Planificado') AS planificados,
          COUNT(*) FILTER (WHERE fecha_fin_estimada < NOW() AND estado NOT IN ('Finalizado', 'Cancelado')) AS atrasados,
          COALESCE(SUM(presupuesto_estimado), 0) AS presupuesto_total
        FROM proyectos
      `),

      // Compras: total y suma
      pool.query(`
        SELECT
          COUNT(*) AS total_compras,
          COALESCE(SUM(total), 0) AS monto_total,
          COALESCE(SUM(total) FILTER (WHERE fecha_compra >= NOW() - INTERVAL '30 days'), 0) AS monto_mes
        FROM compras_materiales
      `),

      // Material más usado por cantidad comprada
      pool.query(`
        SELECT m.nombre, COALESCE(SUM(cm.cantidad), 0) AS total_qty
        FROM materiales m
        LEFT JOIN compras_materiales cm ON cm.material_id = m.id
        GROUP BY m.id, m.nombre
        ORDER BY total_qty DESC
        LIMIT 1
      `),

      // Proyecto con mayor presupuesto
      pool.query(`
        SELECT nombre, presupuesto_estimado
        FROM proyectos
        ORDER BY presupuesto_estimado DESC NULLS LAST
        LIMIT 1
      `),

      // Avance promedio general
      pool.query(`
        SELECT COALESCE(AVG(porcentaje_avance), 0) AS promedio
        FROM avances_obra
      `),

      // Materiales bajo stock (<= 10)
      pool.query(`
        SELECT
          COUNT(*) AS total_bajo,
          COUNT(*) FILTER (WHERE stock <= 5) AS critico
        FROM materiales
        WHERE stock <= 10
      `),

      // Proyectos atrasados detalle
      pool.query(`
        SELECT id, nombre, fecha_fin_estimada, estado
        FROM proyectos
        WHERE fecha_fin_estimada < NOW() AND estado NOT IN ('Finalizado', 'Cancelado')
        ORDER BY fecha_fin_estimada ASC
        LIMIT 5
      `),

      // Compras por mes (últimos 6 meses)
      pool.query(`
        SELECT
          TO_CHAR(DATE_TRUNC('month', fecha_compra), 'Mon YY') AS mes,
          COALESCE(SUM(total), 0) AS total
        FROM compras_materiales
        WHERE fecha_compra >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', fecha_compra)
        ORDER BY DATE_TRUNC('month', fecha_compra) ASC
      `),

      // Avance por proyecto (último avance registrado)
      pool.query(`
        SELECT
          p.nombre AS proyecto,
          COALESCE(
            (SELECT ao.porcentaje_avance FROM avances_obra ao
             WHERE ao.proyecto_id = p.id
             ORDER BY ao.id DESC LIMIT 1), 0
          ) AS porcentaje
        FROM proyectos p
        ORDER BY p.id DESC
        LIMIT 8
      `),

      // Compras por material (top 6)
      pool.query(`
        SELECT m.nombre, COALESCE(SUM(cm.cantidad), 0) AS total_qty, COALESCE(SUM(cm.total), 0) AS total_monto
        FROM materiales m
        LEFT JOIN compras_materiales cm ON cm.material_id = m.id
        GROUP BY m.id, m.nombre
        ORDER BY total_monto DESC
        LIMIT 6
      `)
    ]);

    res.json({
      proyectos: resumenProyectos.rows[0],
      compras: resumenCompras.rows[0],
      material_top: materialMasUsado.rows[0] || null,
      proyecto_mayor: proyectoMayorPresupuesto.rows[0] || null,
      avance_promedio: parseFloat(avancePromedio.rows[0]?.promedio || 0).toFixed(1),
      materiales_stock: materialesBajoStock.rows[0],
      proyectos_atrasados: proyectosAtrasados.rows,
      grafica_compras_mes: {
        labels: comprasPorMes.rows.map(r => r.mes),
        data: comprasPorMes.rows.map(r => parseFloat(r.total))
      },
      grafica_avance: {
        labels: avancePorProyecto.rows.map(r => r.proyecto),
        data: avancePorProyecto.rows.map(r => parseFloat(r.porcentaje))
      },
      grafica_materiales: {
        labels: compraPorMaterial.rows.map(r => r.nombre),
        data: compraPorMaterial.rows.map(r => parseFloat(r.total_qty)),
        montos: compraPorMaterial.rows.map(r => parseFloat(r.total_monto))
      }
    });

  } catch (error) {
    console.error("Dashboard KPI error:", error);
    res.status(500).json({ error: error.message });
  }
};
