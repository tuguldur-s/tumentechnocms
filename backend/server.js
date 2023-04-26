let timer = null;
let checker = null;
const db = require("./database/connection");

var timerStart = function() {
  clearInterval(timer);
  clearInterval(checker);
  timer = setInterval(updateTimer, 21600000);
  // checker = setInterval(dayChecker, 3600000);
  checker = setInterval(dayChecker, 10000);
}

// const alterTable = function() {
//   const string = `SELECT table_name as colname FROM information_schema.tables WHERE table_schema = 'icbc'`;
//   db.query(string, (err, table) => {
//     table.forEach(element => {
//       const datatype = `SELECT DATA_TYPE from INFORMATION_SCHEMA. COLUMNS where table_schema = 'icbc' and table_name = '${element.colname}' and COLUMN_NAME = 'id'`
//       db.query(datatype, (err, type) => {
//         const alter = `ALTER TABLE ${element.colname} CHANGE id id ${type[0].DATA_TYPE} AUTO_INCREMENT NOT NULL;`;
//         db.query(alter, err => {
//           if (err) {
//             throw err;
//           }
//         });
//       });
//     });
//   });
// }

var updateTimer =  function () {
  let check = `UPDATE users SET loyalty = (CASE WHEN loyalty >= 10 THEN loyalty - 10 WHEN loyalty < 10 THEN 0 END), loyalty_at = NOW() WHERE id in (SELECT id from users WHERE loyalty_at <= DATE_ADD(loyalty_at, INTERVAL 30 DAY) AND DATEDIFF(NOW(), loyalty_at) >= 30 AND posID = 6)`;
  db.query(check, err => {
    if(err) {
      throw err;
    }

    var d = new Date();
    if(d.getDate() == 1) {
      db.query(`UPDATE users SET feedback = 100, response = 100`, async err => {
        if( err ) {
          throw err;
        }
      });
    }
  });
}

var dayChecker =  function () {
  var d = new Date();
  var date = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  if(date.getDate() == d.getDate()) {
  // if(6 == d.getDate()) {
    db.query(`SELECT code from store_location`, async (err, store) => {
      if(err) {
        throw err;
      }
      var q = `INSERT INTO store_archive (storeId, date, totalSale, totalCost, totalWhole) VALUES ?`;
      var price = '';
      store.forEach(el => {
        if(price == '') {
          price = `SUM(sale_price * ${el.code}) as Sale${el.code}, SUM(wholesale_price * ${el.code}) as Whole${el.code}, SUM(cost_price * ${el.code}) as Cost${el.code}`
        } else {
          price += `, SUM(sale_price * ${el.code}) as Sale${el.code}, SUM(wholesale_price * ${el.code}) as Whole${el.code}, SUM(cost_price * ${el.code}) as Cost${el.code}`
        }
      });
      db.query(`SELECT ${price} from product`, async (err, product) => {
        if(err) {
          throw err;
        }
        db.query(`SELECT id from store_archive WHERE date = '${d.getFullYear()}-${d.getMonth()+1}'`, async (err, c) => {
          if(err) {
            throw err;
          }
          if(c.length <= 0) {
            var rows = [];
            store.forEach(el => {
              rows.push([el.code, d.getFullYear() + '-' + (d.getMonth() + 1), product[0][`Sale${el.code}`], product[0][`Cost${el.code}`], product[0][`Whole${el.code}`]]);
            });
            db.query(q, [rows], async err => {
              if(err) {
                throw err;
              }
              console.log('archived');
            });
          }
        });
      });
    });
  }
}

db.connect(err => {
  if(err) {
    throw err
  }
  console.log('My sql connected');

  // alterTable();
});

const app = require('./app');
const port = 8005;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    timerStart();
});

const io = require("socket.io")(server);
const jwt = require("jwt-then");

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, 'HS256');
    socket.userId = payload.id;
    next();
  } catch (err) {}
});


io.on("connection", (socket) => {

  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

});