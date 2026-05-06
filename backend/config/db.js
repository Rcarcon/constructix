const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "constructix_db",
    password: "Rcarcon10",
    port: 5432,
});

pool.connect()
    .then(() => console.log("Conexión a PostgreSQL exitosa"))
    .catch(err => console.log(err));

module.exports = pool;