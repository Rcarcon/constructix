const express = require("express");
const router = express.Router();
const { obtenerKPIs } = require("../controllers/dashboard.controller");

router.get("/", obtenerKPIs);

module.exports = router;
