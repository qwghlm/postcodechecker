// Database setup
require("dotenv").config();

// Debug code for the console
const initOptions = {
  query(e) {
    console.log('QUERY:', e.query);
  },
  receive(data, { duration }, e) {
    console.log(`Executed in ${duration}ms`);
  }
};

const pgp = require("pg-promise")(initOptions);

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;

const connection = `postgres://${username}:${password}@${host}:${port}/${database}`;
const db = { conn: pgp(connection) };

module.exports = { db };
