const mongoose = require("mongoose");

const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const Payment = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, required: true },
});

// Add Plugin
Payment.plugin(mongooseDelete, { overrideMethods: true, deletedAt: true });

module.exports = mongoose.model("payments", Payment);
