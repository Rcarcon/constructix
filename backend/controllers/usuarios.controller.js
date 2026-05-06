const pool = require("../config/db");

const obtenerUsuarios = async (req, res) => {
    try {
        const resultado = await pool.query("SELECT * FROM usuarios");

        res.json(resultado.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Error al obtener usuarios"
        });
    }
};

module.exports = {
    obtenerUsuarios
};