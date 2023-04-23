const mysql = require("mysql");
var os = require("os");
let obj = {};
if (os.hostname() === 'DESKTOP-AQH5C0N') {
  obj = {
    host: 'localhost',
    database: 'icbc',
    user: 'root',
    password: ''
  };
} else {
  obj = {
    host: 'db-mysql-sgp1-66799-do-user-11118497-0.b.db.ondigitalocean.com',
    database: 'icbc',
    user: 'testadmin',
    port: 25060,
    ssl: {
      //ca: fs.readFileSync("./public/contents/ca-certificate.crt"),
      ca: fs.readFileSync("./public/contents/ca-certificate.crt"),
    },
    password: 'AVNS_FvgreVmM7HlicMArR2V'
  }
}
const db = mysql.createConnection(obj);

// const db = mysql.createConnection({
//   host: 'localhost',
//   database: 'admin_icbc',
//   user: 'icbc',
//   port: 3306,
//   password: 'Mongol8899@'
// });

module.exports = db;