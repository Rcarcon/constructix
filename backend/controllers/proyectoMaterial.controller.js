const ProyectoMaterial = require("../models/proyectoMaterial.model");

const obtenerProyectoMateriales = async (req, res) => {
  try {
    const datos = await ProyectoMaterial.obtenerTodos();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener materiales del proyecto", error: error.message });
  }
};

const crearProyectoMaterial = async (req, res) => {
  try {
    const dato = await ProyectoMaterial.crear(req.body);
    res.status(201).json({
      mensaje: "Material asignado al proyecto correctamente",
      dato
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al asignar material al proyecto", error: error.message });
  }
};

const actualizarProyectoMaterial = async (req, res) => {
  try {
    const dato = await ProyectoMaterial.actualizar(req.params.id, req.body);

    if (!dato) {
      return res.status(404).json({ mensaje: "Registro no encontrado" });
    }

    res.json({
      mensaje: "Asignación actualizada correctamente",
      dato
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar asignación", error: error.message });
  }
};

const eliminarProyectoMaterial = async (req, res) => {
  try {
    const dato = await ProyectoMaterial.eliminar(req.params.id);

    if (!dato) {
      return res.status(404).json({ mensaje: "Registro no encontrado" });
    }

    res.json({ mensaje: "Asignación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar asignación", error: error.message });
  }
};

module.exports = {
  obtenerProyectoMateriales,
  crearProyectoMaterial,
  actualizarProyectoMaterial,
  eliminarProyectoMaterial
};