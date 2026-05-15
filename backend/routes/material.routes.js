const express = require("express");
const router = express.Router();

const materialController = require("../controllers/material.controller");

router.get("/", materialController.obtenerMateriales);

router.get("/:id", materialController.obtenerMaterialPorId);

router.post("/", materialController.crearMaterial);

router.put("/:id", materialController.actualizarMaterial);

router.delete("/:id", materialController.eliminarMaterial);

module.exports = router;