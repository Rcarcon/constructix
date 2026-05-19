const Avance = require("../models/avance.model");

const obtenerAvances = async (req, res) => {
  try {
    const avances = await Avance.obtenerTodos();
    res.json(avances);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener avances", error: error.message });
  }
};

const crearAvance = async (req, res) => {
  try {
    const avance = await Avance.crear(req.body);
    res.status(201).json({
      mensaje: "Avance creado correctamente",
      avance
    });
} catch (error) {
  console.log("BODY RECIBIDO:", req.body);
  console.log("ERROR:", error.message);
  console.log("DETALLE:", error.detail);
  res.status(500).json({ mensaje: "Error al crear avance", error: error.message });
}
};

const actualizarAvance = async (req, res) => {
  try {
    const avance = await Avance.actualizar(req.params.id, req.body);

    if (!avance) {
      return res.status(404).json({ mensaje: "Avance no encontrado" });
    }

    res.json({
      mensaje: "Avance actualizado correctamente",
      avance
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar avance", error: error.message });
  }
};

const eliminarAvance = async (req, res) => {
  try {
    const avance = await Avance.eliminar(req.params.id);

    if (!avance) {
      return res.status(404).json({ mensaje: "Avance no encontrado" });
    }

    res.json({ mensaje: "Avance eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar avance", error: error.message });
  }
};

module.exports = {
  obtenerAvances,
  crearAvance,
  actualizarAvance,
  eliminarAvance
};