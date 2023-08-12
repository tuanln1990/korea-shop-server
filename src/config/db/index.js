const mongoose = require("mongoose");

async function connect() {
  try {
<<<<<<< HEAD
    await mongoose.connect(
      "mongodb+srv://admin:21%23%40%21Abc@sandbox.ecy3lsy.mongodb.net/"
    );
=======
    await mongoose.connect("mongodb+srv://admin:21%23%40%21Abc@sandbox.ecy3lsy.mongodb.net/");
>>>>>>> 1034364f973b0d7bde5e8577d8895e9d399f620d
    console.log("connect suscessful !!!");
  } catch (errors) {
    console.log("Connect failed !!!");
  }
}

module.exports = { connect };
