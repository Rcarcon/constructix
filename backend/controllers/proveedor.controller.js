const Proveedor = require("../models/proveedor.model");

const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.obtenerTodos();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener proveedores", error: error.message });
  }
};

const crearProveedor = async (req, res) => {
  try {
    const proveedor = await Proveedor.crear(req.body);
    res.status(201).json({
      mensaje: "Proveedor creado correctamente",
      proveedor
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear proveedor", error: error.message });
  }
};

const actualizarProveedor = async (req, res) => {
  try {
    const proveedor = await Proveedor.actualizar(req.params.id, req.body);

    if (!proveedor) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }

    res.json({
      mensaje: "Proveedor actualizado correctamente",
      proveedor
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar proveedor", error: error.message });
  }
};

const eliminarProveedor = async (req, res) => {
  try {
    const proveedor = await Proveedor.eliminar(req.params.id);

    if (!proveedor) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }

    res.json({ mensaje: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar proveedor", error: error.message });
  }
};

module.exports = {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
};