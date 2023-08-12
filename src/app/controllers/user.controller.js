const User = require("../models/User.model");
class UserController {
  allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };

  userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };

  adminBoard = (req, res) => {
    res.send({ status: "ok" });
  };

  moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };
}

module.exports = new UserController();
