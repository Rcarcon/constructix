const express = require("express");
const router = express.Router();

const {
    obtenerUsuarios
} = require("../controllers/usuarios.controller");

router.get("/", obtenerUsuarios);

module.exports = router;