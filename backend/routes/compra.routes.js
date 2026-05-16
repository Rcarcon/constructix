const express = require("express");
const router = express.Router();

const {
  obtenerCompras,
  crearCompra,
  actualizarCompra,
  eliminarCompra
} = require("../controllers/compra.controller");

router.get("/", obtenerCompras);
router.post("/", crearCompra);
router.put("/:id", actualizarCompra);
router.delete("/:id", eliminarCompra);

module.exports = router;