const Cliente = require("../models/cliente.model");

const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.obtenerTodos();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener clientes", error: error.message });
  }
};

const crearCliente = async (req, res) => {
  try {
    const cliente = await Cliente.crear(req.body);
    res.status(201).json({
      mensaje: "Cliente creado correctamente",
      cliente
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear cliente", error: error.message });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.actualizar(req.params.id, req.body);

    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    res.json({
      mensaje: "Cliente actualizado correctamente",
      cliente
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar cliente", error: error.message });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.eliminar(req.params.id);

    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    res.json({ mensaje: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar cliente", error: error.message });
  }
};

module.exports = {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente
};