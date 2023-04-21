const mysql = require("mysql");
const db = mysql.createConnection({
  host: 'localhost',
  database: 'icbc',
  user: 'root',
  password: ''
});

// const db = mysql.createConnection({
//   host: 'localhost',
//   database: 'admin_icbc',
//   user: 'icbc',
//   port: 3306,
//   password: 'Mongol8899@'
// });

module.exports = db;