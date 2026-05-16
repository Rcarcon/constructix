const express = require("express");
const router = express.Router();

const {
  obtenerProyectoMateriales,
  crearProyectoMaterial,
  actualizarProyectoMaterial,
  eliminarProyectoMaterial
} = require("../controllers/proyectoMaterial.controller");

router.get("/", obtenerProyectoMateriales);
router.post("/", crearProyectoMaterial);
router.put("/:id", actualizarProyectoMaterial);
router.delete("/:id", eliminarProyectoMaterial);

module.exports = router;