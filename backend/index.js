require("./config/db");
require('./models/presupuesto.model');
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Rutas existentes (sin cambios)
const usuariosRoutes = require("./routes/usuarios.routes");
const proyectosRoutes = require("./routes/proyecto.routes");
const materialesRoutes = require("./routes/material.routes");
const presupuestoRoutes = require('./routes/presupuesto.routes');
const avanceRoutes = require("./routes/avance.routes");
const proveedorRoutes = require("./routes/proveedor.routes");
const clienteRoutes = require("./routes/cliente.routes");
const compraRoutes = require("./routes/compra.routes");
const proyectoMaterialRoutes = require("./routes/proyectoMaterial.routes");

// Nueva ruta dashboard
const dashboardRoutes = require("./routes/dashboard.routes");

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/materiales", materialesRoutes);
app.use("/api/presupuestos", presupuestoRoutes);
app.use("/api/avances", avanceRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/proyecto-materiales", proyectoMaterialRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({ mensaje: "Constructix backend funcionando", version: "2.0" });
});

app.listen(3000, () => {
  console.log("Servidor Constructix corriendo en puerto 3000");
});
