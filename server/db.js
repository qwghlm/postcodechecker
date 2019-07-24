// Database setup
require("dotenv").config();
const pgp = require("pg-promise")();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;

const connection = `postgres://${username}:${password}@${host}:${port}/${database}`;
const db = { conn: pgp(connection) };

module.exports = { db };
