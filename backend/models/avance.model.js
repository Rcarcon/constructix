const pool = require("../config/db");

const Avance = {

  async obtenerTodos() {
    const result = await pool.query(
      "SELECT * FROM avances_obra ORDER BY id DESC"
    );

    return result.rows;
  },

  async obtenerPorId(id) {
    const result = await pool.query(
      "SELECT * FROM avances_obra WHERE id = $1",
      [id]
    );

    return result.rows[0];
  },

async crear(data) {
  const {
    proyecto_id,
    descripcion,
    porcentaje_avance,
    observaciones,
    estado
  } = data;

  const result = await pool.query(
    `INSERT INTO avances_obra
    (proyecto_id, descripcion, porcentaje_avance, observaciones, estado)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [
      proyecto_id,
      descripcion,
      porcentaje_avance,
      observaciones,
      estado || "En proceso"
    ]
  );

  return result.rows[0];
},

async actualizar(id, data) {
  const {
    proyecto_id,
    descripcion,
    porcentaje_avance
  } = data;

  const result = await pool.query(
    `UPDATE avances_obra SET
      proyecto_id = $1,
      descripcion = $2,
      porcentaje_avance = $3
    WHERE id = $4
    RETURNING *`,
    [
      proyecto_id,
      descripcion,
      porcentaje_avance,
      id
    ]
  );

  return result.rows[0];
},
  async eliminar(id) {
    const result = await pool.query(
      "DELETE FROM avances_obra WHERE id = $1 RETURNING *",
      [id]
    );

    return result.rows[0];
  }

};

module.exports = Avance;