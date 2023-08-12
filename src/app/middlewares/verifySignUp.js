const User = require("../models/User.model");

const checkDuplicate = (req, res, next) => {
  let errList = [];
  try {
    // Check mail
    const checkEmail = User.findOne({
      email: req.body.email,
    });
    // Check Phone number
    const checkPhone = User.findOne({
      phoneNumber: req.body.phoneNumber,
    });

    Promise.all([checkEmail, checkPhone])
      .then(([mail, phone]) => {
        if (mail) errList.push("Mail đã tồn tại");
        if (mail) errList.push("Số điện thoại đã tồn tại");
        if (errList.length) {
          return res.send(errList);
        }
        next();
      })
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).json({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicate,
  checkRolesExisted,
};

module.exports = verifySignUp;
