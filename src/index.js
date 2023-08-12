const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const path = require("path");

// Khai baos local
const route = require("./routes");
const db = require("./config/db");

// khai báo port
const port = 5000;
var corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

//Static file
app.use(express.static(path.join(__dirname, "public")));

// add-on
// app.use(morgan("combined"));

//khởi động dự án
app.use(express.urlencoded({ extended: true })); // xử lý dữ liệu từ form (lưu vào req.body)
app.use(express.json()); // xử lý dữ liệu từ javascript (axios,fetch) (lưu vào req.body)
db.connect();
route(app);
app.listen(port, () => {
  console.log("My webservices use port " + port);
});
