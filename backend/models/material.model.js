const pool = require("../config/db");

const Material = {

  async obtenerTodos() {
    const result = await pool.query(
      "SELECT * FROM materiales ORDER BY id DESC"
    );

    return result.rows;
  },

  async obtenerPorId(id) {
    const result = await pool.query(
      "SELECT * FROM materiales WHERE id = $1",
      [id]
    );

    return result.rows[0];
  },

  async crear(data) {

    const {
      nombre,
      descripcion,
      unidad_medida,
      precio_unitario,
      stock,
      proveedor
    } = data;

    const result = await pool.query(
      `INSERT INTO materiales
      (nombre, descripcion, unidad_medida, precio_unitario, stock, proveedor)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        nombre,
        descripcion,
        unidad_medida,
        precio_unitario,
        stock,
        proveedor
      ]
    );

    return result.rows[0];
  },

  async actualizar(id, data) {

    const {
      nombre,
      descripcion,
      unidad_medida,
      precio_unitario,
      stock,
      proveedor
    } = data;

    const result = await pool.query(
      `UPDATE materiales SET
        nombre = $1,
        descripcion = $2,
        unidad_medida = $3,
        precio_unitario = $4,
        stock = $5,
        proveedor = $6
      WHERE id = $7
      RETURNING *`,
      [
        nombre,
        descripcion,
        unidad_medida,
        precio_unitario,
        stock,
        proveedor,
        id
      ]
    );

    return result.rows[0];
  },

  async eliminar(id) {
    const result = await pool.query(
      "DELETE FROM materiales WHERE id = $1 RETURNING *",
      [id]
    );

    return result.rows[0];
  }

};

module.exports = Material;