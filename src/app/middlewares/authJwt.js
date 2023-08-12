const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Role = require("../models/Role.model");

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.send({ status: "notToken", message: "Chưa cung cấp token" });
  }
  token = token.split(" ")[1];

  jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
    if (err) {
      return res.send({
        status: "anauthorized",
        message: "Bạn không có quyền truy cập !",
      });
    }
    req.email = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.email)
    .then((user) => {
      Role.find({
        _id: { $in: user.roles },
      })
        .then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
              next();
              return;
            }
          }
          res.send({
            status: "notOk",
            message: "Bạn không phải admin hệ thống!",
          });
          return;
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

const isModerator = (req, res, next) => {
  User.findById(req.email)
    .then((user) => {
      Role.find({
        _id: { $in: user.roles },
      })
        .then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
              next();
              return;
            }
          }
          res.status(403).send({ message: "Require moderator Role!" });
          return;
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};
module.exports = authJwt;
