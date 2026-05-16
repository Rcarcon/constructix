const Compra = require("../models/compra.model");

const obtenerCompras = async (req, res) => {
  try {
    const compras = await Compra.obtenerTodos();
    res.json(compras);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener compras", error: error.message });
  }
};

const crearCompra = async (req, res) => {
  try {
    const compra = await Compra.crear(req.body);
    res.status(201).json({
      mensaje: "Compra creada correctamente",
      compra
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear compra", error: error.message });
  }
};

const actualizarCompra = async (req, res) => {
  try {
    const compra = await Compra.actualizar(req.params.id, req.body);

    if (!compra) {
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }

    res.json({
      mensaje: "Compra actualizada correctamente",
      compra
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar compra", error: error.message });
  }
};

const eliminarCompra = async (req, res) => {
  try {
    const compra = await Compra.eliminar(req.params.id);

    if (!compra) {
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }

    res.json({ mensaje: "Compra eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar compra", error: error.message });
  }
};

module.exports = {
  obtenerCompras,
  crearCompra,
  actualizarCompra,
  eliminarCompra
};