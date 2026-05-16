const express = require('express');
const router = express.Router();

const {
  obtenerPresupuestos,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto
} = require('../controllers/presupuesto.controller');

router.get('/', obtenerPresupuestos);
router.post('/', crearPresupuesto);
router.put('/:id', actualizarPresupuesto);
router.delete('/:id', eliminarPresupuesto);

module.exports = router;