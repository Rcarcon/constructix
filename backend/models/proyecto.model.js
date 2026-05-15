const pool = require("../config/db");

const Proyecto = {
  async obtenerTodos() {
    const result = await pool.query(
      "SELECT * FROM proyectos ORDER BY id DESC"
    );

    return result.rows;
  },

  async obtenerPorId(id) {
    const result = await pool.query(
      "SELECT * FROM proyectos WHERE id = $1",
      [id]
    );

    return result.rows[0];
  },

  async crear(data) {
    const {
      nombre,
      cliente,
      ubicacion,
      fecha_inicio,
      fecha_fin_estimada,
      presupuesto_estimado,
      estado,
    } = data;

    const result = await pool.query(
      `INSERT INTO proyectos
      (nombre, cliente, ubicacion, fecha_inicio, fecha_fin_estimada, presupuesto_estimado, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        nombre,
        cliente,
        ubicacion,
        fecha_inicio,
        fecha_fin_estimada,
        presupuesto_estimado,
        estado,
      ]
    );

    return result.rows[0];
  },

  async actualizar(id, data) {
    const {
      nombre,
      cliente,
      ubicacion,
      fecha_inicio,
      fecha_fin_estimada,
      presupuesto_estimado,
      estado,
    } = data;

    const result = await pool.query(
      `UPDATE proyectos SET
        nombre = $1,
        cliente = $2,
        ubicacion = $3,
        fecha_inicio = $4,
        fecha_fin_estimada = $5,
        presupuesto_estimado = $6,
        estado = $7
      WHERE id = $8
      RETURNING *`,
      [
        nombre,
        cliente,
        ubicacion,
        fecha_inicio,
        fecha_fin_estimada,
        presupuesto_estimado,
        estado,
        id,
      ]
    );

    return result.rows[0];
  },

  async eliminar(id) {
    const result = await pool.query(
      "DELETE FROM proyectos WHERE id = $1 RETURNING *",
      [id]
    );

    return result.rows[0];
  },
};

module.exports = Proyecto;