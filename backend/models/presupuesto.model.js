const pool = require("../config/db");

const Presupuesto = {

  async obtenerTodos() {
    const result = await pool.query(
      "SELECT * FROM presupuestos ORDER BY id DESC"
    );

    return result.rows;
  },

  async obtenerPorId(id) {
    const result = await pool.query(
      "SELECT * FROM presupuestos WHERE id = $1",
      [id]
    );

    return result.rows[0];
  },

  async crear(data) {
    const {
      nombre,
      descripcion,
      costo_materiales,
      costo_mano_obra,
      costo_total,
      estado
    } = data;

    const result = await pool.query(
      `INSERT INTO presupuestos
      (nombre, descripcion, costo_materiales, costo_mano_obra, costo_total, estado)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        nombre,
        descripcion,
        costo_materiales,
        costo_mano_obra,
        costo_total,
        estado || "Pendiente"
      ]
    );

    return result.rows[0];
  },

  async actualizar(id, data) {
    const {
      nombre,
      descripcion,
      costo_materiales,
      costo_mano_obra,
      costo_total,
      estado
    } = data;

    const result = await pool.query(
      `UPDATE presupuestos SET
        nombre = $1,
        descripcion = $2,
        costo_materiales = $3,
        costo_mano_obra = $4,
        costo_total = $5,
        estado = $6
      WHERE id = $7
      RETURNING *`,
      [
        nombre,
        descripcion,
        costo_materiales,
        costo_mano_obra,
        costo_total,
        estado,
        id
      ]
    );

    return result.rows[0];
  },

  async eliminar(id) {
    const result = await pool.query(
      "DELETE FROM presupuestos WHERE id = $1 RETURNING *",
      [id]
    );

    return result.rows[0];
  }

};

module.exports = Presupuesto;