require("./config/db");
require('./models/presupuesto.model');
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const usuariosRoutes = require("./routes/usuarios.routes");
const proyectosRoutes = require("./routes/proyecto.routes");
const materialesRoutes = require("./routes/material.routes");
const presupuestoRoutes = require('./routes/presupuesto.routes');
const avanceRoutes = require("./routes/avance.routes");
const proveedorRoutes = require("./routes/proveedor.routes");
const clienteRoutes = require("./routes/cliente.routes");
const compraRoutes = require("./routes/compra.routes");
const proyectoMaterialRoutes = require("./routes/proyectoMaterial.routes");


app.use("/api/usuarios", usuariosRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/materiales", materialesRoutes);
app.use("/api/presupuestos", presupuestoRoutes);
app.use("/api/avances", avanceRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/proyecto-materiales", proyectoMaterialRoutes);

app.get("/", (req, res) => {
    res.send("Constructix backend funcionando");
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});