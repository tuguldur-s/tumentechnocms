const mysql = require("mysql");
const fs = require('fs');
var os = require("os");
let obj = {};

obj = {
  host: 'db-mysql-sgp1-66799-do-user-11118497-0.b.db.ondigitalocean.com',
  database: 'icbc',
  user: 'icbcadmin',
  port: 25060,
  ssl: {
    //ca: fs.readFileSync("./public/contents/ca-certificate.crt"),
    ca: fs.readFileSync("./public/ca-certificate.crt"),
  },
  password: 'AVNS_S-g3EBndCYL7KL2JvuJ'
}
// if (os.hostname() === 'DESKTOP-AQH5C0N') {
//   // obj = {
//   //   host: 'localhost',
//   //   database: 'icbc',
//   //   user: 'root',
//   //   password: ''
//   // };

//   obj = {
//     host: 'db-mysql-sgp1-66799-do-user-11118497-0.b.db.ondigitalocean.com',
//     database: 'icbc',
//     user: 'icbcadmin',
//     port: 25060,
//     ssl: {
//       //ca: fs.readFileSync("./public/contents/ca-certificate.crt"),
//       ca: fs.readFileSync("./public/ca-certificate.crt"),
//     },
//     password: 'AVNS_S-g3EBndCYL7KL2JvuJ'
//   }
// } else {
//   obj = {
//     host: 'db-mysql-sgp1-66799-do-user-11118497-0.b.db.ondigitalocean.com',
//     database: 'icbc',
//     user: 'icbcadmin',
//     port: 25060,
//     ssl: {
//       //ca: fs.readFileSync("./public/contents/ca-certificate.crt"),
//       ca: fs.readFileSync("./public/ca-certificate.crt"),
//     },
//     password: 'AVNS_S-g3EBndCYL7KL2JvuJ'
//   }
// }
const db = mysql.createConnection(obj);
module.exports = db;