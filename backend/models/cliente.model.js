const pool = require("../config/db");

const Cliente = {

  async obtenerTodos() {
    const result = await pool.query(
      "SELECT * FROM clientes ORDER BY id DESC"
    );

    return result.rows;
  },

  async obtenerPorId(id) {
    const result = await pool.query(
      "SELECT * FROM clientes WHERE id = $1",
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
      tipo_cliente
    } = data;

    const result = await pool.query(
      `INSERT INTO clientes
      (nombre, telefono, correo, direccion, tipo_cliente)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        nombre,
        telefono,
        correo,
        direccion,
        tipo_cliente
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
      tipo_cliente
    } = data;

    const result = await pool.query(
      `UPDATE clientes SET
        nombre = $1,
        telefono = $2,
        correo = $3,
        direccion = $4,
        tipo_cliente = $5
      WHERE id = $6
      RETURNING *`,
      [
        nombre,
        telefono,
        correo,
        direccion,
        tipo_cliente,
        id
      ]
    );

    return result.rows[0];
  },

  async eliminar(id) {
    const result = await pool.query(
      "DELETE FROM clientes WHERE id = $1 RETURNING *",
      [id]
    );

    return result.rows[0];
  }

};

module.exports = Cliente;