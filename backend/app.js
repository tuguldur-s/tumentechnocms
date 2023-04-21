const express = require("express");
var cors = require('cors')
const app = express();
const fileupload = require('express-fileupload');

app.use(express.json());
app.use(fileupload());
app.use(cors({
  exposedHeaders: "*"
}));
app.use(express.urlencoded({ extended: true }));
//Bring in the routes
app.use("/api/user", require("./routes/user"));
// app.use("/api/admin", require("./routes/admin"));
app.use("/api/product", require("./routes/product"));
app.use("/api/order", require("./routes/order"));
app.use("/api/invoice", require("./routes/invoice"));
app.use("/api/offer", require("./routes/offer"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/usefull", require("./routes/usefull"));
app.use("/api/expend", require("./routes/expend"));
app.use("/api/bi", require("./routes/bi"));

app.use(express.static('public'))

//Setup Error Handlers
const errorHandlers = require("./handlers/errorHandler");
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

module.exports = app;