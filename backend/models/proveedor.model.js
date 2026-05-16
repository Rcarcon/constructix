const pool = require("../config/db");

const Proveedor = {

  async obtenerTodos() {
    const result = await pool.query(
      "SELECT * FROM proveedores ORDER BY id DESC"
    );

    return result.rows;
  },

  async obtenerPorId(id) {
    const result = await pool.query(
      "SELECT * FROM proveedores WHERE id = $1",
      [id]
    );

    return result.rows[0];
  },

  async crear(data) {
    const {
      nombre,
      telefono,
      correo,
      direccion,
      tipo_material
    } = data;

    const result = await pool.query(
      `INSERT INTO proveedores
      (nombre, telefono, correo, direccion, tipo_material)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        nombre,
        telefono,
        correo,
        direccion,
        tipo_material
      ]
    );

    return result.rows[0];
  },

  async actualizar(id, data) {
    const {
      nombre,
      telefono,
      correo,
      direccion,
      tipo_material
    } = data;

    const result = await pool.query(
      `UPDATE proveedores SET
        nombre = $1,
        telefono = $2,
        correo = $3,
        direccion = $4,
        tipo_material = $5
      WHERE id = $6
      RETURNING *`,
      [
        nombre,
        telefono,
        correo,
        direccion,
        tipo_material,
        id
      ]
    );

    return result.rows[0];
  },

  async eliminar(id) {
    const result = await pool.query(
      "DELETE FROM proveedores WHERE id = $1 RETURNING *",
      [id]
    );

    return result.rows[0];
  }

};

module.exports = Proveedor;