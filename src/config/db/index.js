const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb+srv://admin:21%23%40%21Abc@sandbox.ecy3lsy.mongodb.net/");
    console.log("connect suscessful !!!");
  } catch (errors) {
    console.log("Connect failed !!!");
  }
}

module.exports = { connect };
