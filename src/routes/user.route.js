const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/user.controller");
const authJwt = require("../app/middlewares/authJwt");

router.get(
  "/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.adminBoard
);
router.get("/", authJwt.verifyToken, userController.userBoard);

module.exports = router;
