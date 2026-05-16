const express = require("express");
const router = express.Router();

const {
  obtenerAvances,
  crearAvance,
  actualizarAvance,
  eliminarAvance
} = require("../controllers/avance.controller");

router.get("/", obtenerAvances);
router.post("/", crearAvance);
router.put("/:id", actualizarAvance);
router.delete("/:id", eliminarAvance);

module.exports = router;