const config = require("config");
const mysql = require("mysql");

const servername = config.get("servername");
const username = config.get("username");
const password = config.get("password");
const dbname = config.get("dbname");

const db = mysql.createConnection({
  host: servername,
  user: username,
  password: password,
  database: dbname
});

module.exports = db;
