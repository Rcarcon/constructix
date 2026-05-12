require("./config/db");
const express = require("express");
const app = express();

app.use(express.json());

const usuariosRoutes = require("./routes/usuarios.routes");

app.use("/usuarios", usuariosRoutes);

app.get("/", (req, res) => {
    res.send("Constructix backend funcionando");
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});