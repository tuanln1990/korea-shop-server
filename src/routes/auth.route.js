const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/auth.controller");
const verifySignUp = require("../app/middlewares/verifySignUp");

router.post(
  "/signup",
  [verifySignUp.checkDuplicate, verifySignUp.checkRolesExisted],
  authController.signup
);
router.post("/signin", authController.signin);

module.exports = router;
