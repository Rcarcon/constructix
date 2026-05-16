require('dotenv').config({ path: "./.env" });

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: process.env.DB_PORT
});

pool.connect()
  .then(() => console.log("Conexión a PostgreSQL exitosa"))
  .catch(err => console.log(err));

module.exports = pool;