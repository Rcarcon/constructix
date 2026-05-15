const Proyecto = require("../models/proyecto.model");

exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.obtenerTodos();

    res.json(proyectos);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.obtenerProyectoPorId = async (req, res) => {
  try {

    const proyecto = await Proyecto.obtenerPorId(req.params.id);

    if (!proyecto) {
      return res.status(404).json({
        mensaje: "Proyecto no encontrado"
      });
    }

    res.json(proyecto);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.crearProyecto = async (req, res) => {
  try {

    const nuevoProyecto = await Proyecto.crear(req.body);

    res.status(201).json({
      mensaje: "Proyecto creado correctamente",
      proyecto: nuevoProyecto
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.actualizarProyecto = async (req, res) => {
  try {

    const proyectoActualizado = await Proyecto.actualizar(
      req.params.id,
      req.body
    );

    res.json({
      mensaje: "Proyecto actualizado",
      proyecto: proyectoActualizado
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.eliminarProyecto = async (req, res) => {
  try {

    const proyectoEliminado = await Proyecto.eliminar(req.params.id);

    res.json({
      mensaje: "Proyecto eliminado",
      proyecto: proyectoEliminado
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};