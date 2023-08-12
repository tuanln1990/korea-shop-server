const mongoose = require("mongoose");

const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const User = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    paymentInfo: { type: Object },
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
    address: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "roles" }],
  },
  {
    timestamps: true,
  }
);

User.plugin(mongooseDelete, { overrideMethods: true, deletedAt: true });

module.exports = mongoose.model("users", User);
