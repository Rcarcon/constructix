const pool = require("../config/db");

const Compra = {

  async obtenerTodos() {
    const result = await pool.query(
      "SELECT * FROM compras_materiales ORDER BY id DESC"
    );

    return result.rows;
  },

  async obtenerPorId(id) {
    const result = await pool.query(
      "SELECT * FROM compras_materiales WHERE id = $1",
      [id]
    );

    return result.rows[0];
  },

  async crear(data) {
    const {
      material_id,
      proveedor_id,
      cantidad,
      precio_unitario,
      total,
      fecha_compra,
      estado
    } = data;

    const result = await pool.query(
      `INSERT INTO compras_materiales
      (material_id, proveedor_id, cantidad, precio_unitario, total, fecha_compra, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        material_id,
        proveedor_id,
        cantidad,
        precio_unitario,
        total,
        fecha_compra,
        estado || "Registrada"
      ]
    );

    return result.rows[0];
  },

  async actualizar(id, data) {
    const {
      material_id,
      proveedor_id,
      cantidad,
      precio_unitario,
      total,
      fecha_compra,
      estado
    } = data;

    const result = await pool.query(
      `UPDATE compras_materiales SET
        material_id = $1,
        proveedor_id = $2,
        cantidad = $3,
        precio_unitario = $4,
        total = $5,
        fecha_compra = $6,
        estado = $7
      WHERE id = $8
      RETURNING *`,
      [
        material_id,
        proveedor_id,
        cantidad,
        precio_unitario,
        total,
        fecha_compra,
        estado,
        id
      ]
    );

    return result.rows[0];
  },

  async eliminar(id) {
    const result = await pool.query(
      "DELETE FROM compras_materiales WHERE id = $1 RETURNING *",
      [id]
    );

    return result.rows[0];
  }

};

module.exports = Compra;