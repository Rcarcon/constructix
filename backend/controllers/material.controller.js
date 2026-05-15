const Material = require("../models/material.model");

exports.obtenerMateriales = async (req, res) => {
  try {

    const materiales = await Material.obtenerTodos();

    res.json(materiales);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.obtenerMaterialPorId = async (req, res) => {
  try {

    const material = await Material.obtenerPorId(req.params.id);

    if (!material) {
      return res.status(404).json({
        mensaje: "Material no encontrado"
      });
    }

    res.json(material);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.crearMaterial = async (req, res) => {
  try {

    const nuevoMaterial = await Material.crear(req.body);

    res.status(201).json({
      mensaje: "Material creado correctamente",
      material: nuevoMaterial
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.actualizarMaterial = async (req, res) => {
  try {

    const materialActualizado = await Material.actualizar(
      req.params.id,
      req.body
    );

    res.json({
      mensaje: "Material actualizado",
      material: materialActualizado
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.eliminarMaterial = async (req, res) => {
  try {

    const materialEliminado = await Material.eliminar(req.params.id);

    res.json({
      mensaje: "Material eliminado",
      material: materialEliminado
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};