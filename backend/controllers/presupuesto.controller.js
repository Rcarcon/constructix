const Presupuesto = require("../models/presupuesto.model");

const obtenerPresupuestos = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.obtenerTodos();
    res.json(presupuestos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener presupuestos", error: error.message });
  }
};

const crearPresupuesto = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.crear(req.body);
    res.status(201).json({
      mensaje: "Presupuesto creado correctamente",
      presupuesto
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear presupuesto", error: error.message });
  }
};

const actualizarPresupuesto = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.actualizar(req.params.id, req.body);

    if (!presupuesto) {
      return res.status(404).json({ mensaje: "Presupuesto no encontrado" });
    }

    res.json({
      mensaje: "Presupuesto actualizado correctamente",
      presupuesto
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar presupuesto", error: error.message });
  }
};

const eliminarPresupuesto = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.eliminar(req.params.id);

    if (!presupuesto) {
      return res.status(404).json({ mensaje: "Presupuesto no encontrado" });
    }

    res.json({ mensaje: "Presupuesto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar presupuesto", error: error.message });
  }
};

module.exports = {
  obtenerPresupuestos,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto
};