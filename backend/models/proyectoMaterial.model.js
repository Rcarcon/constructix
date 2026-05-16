const pool = require("../config/db");

const ProyectoMaterial = {

  async obtenerTodos() {
    const result = await pool.query(
      "SELECT * FROM proyecto_materiales ORDER BY id DESC"
    );

    return result.rows;
  },

  async crear(data) {
    const {
      proyecto_id,
      material_id,
      cantidad_usada,
      fecha_asignacion,
      observaciones
    } = data;

    const result = await pool.query(
      `INSERT INTO proyecto_materiales
      (proyecto_id, material_id, cantidad_usada, fecha_asignacion, observaciones)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        proyecto_id,
        material_id,
        cantidad_usada,
        fecha_asignacion,
        observaciones
      ]
    );

    return result.rows[0];
  },

  async actualizar(id, data) {
    const {
      proyecto_id,
      material_id,
      cantidad_usada,
      fecha_asignacion,
      observaciones
    } = data;

    const result = await pool.query(
      `UPDATE proyecto_materiales SET
        proyecto_id = $1,
        material_id = $2,
        cantidad_usada = $3,
        fecha_asignacion = $4,
        observaciones = $5
      WHERE id = $6
      RETURNING *`,
      [
        proyecto_id,
        material_id,
        cantidad_usada,
        fecha_asignacion,
        observaciones,
        id
      ]
    );

    return result.rows[0];
  },

  async eliminar(id) {
    const result = await pool.query(
      "DELETE FROM proyecto_materiales WHERE id = $1 RETURNING *",
      [id]
    );

    return result.rows[0];
  }

};

module.exports = ProyectoMaterial;