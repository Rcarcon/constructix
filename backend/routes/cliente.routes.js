const express = require("express");
const router = express.Router();

const {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} = require("../controllers/cliente.controller");

router.get("/", obtenerClientes);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);

module.exports = router;