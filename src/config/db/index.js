const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/shop");
    console.log("connect suscessful !!!");
  } catch (errors) {
    console.log("Connect failed !!!");
  }
}

module.exports = { connect };
