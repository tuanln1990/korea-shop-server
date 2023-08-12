const User = require("../models/User.model");
const Role = require("../models/Role.model");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

class AuthController {
  //   [POST] /auth/signup
  signup = (req, res) => {
    console.log(req.body.province);
    const user = new User(req.body);
    user.password = user.password
      ? bcrypt.hashSync(req.body.password, 8)
      : null;
    if (req.body.roles) {
      Role.find({
        name: { $in: req.body.roles },
      })
        .then((roles) => {
          user.roles = roles.map((role) => role._id);
          user
            .save()
            .then(() => {
              res.send({ status: "ok" });
            })
            .catch((err) => res.json(err));
        })
        .catch((err) => res.json(err));
    } else {
      Role.findOne({ name: "user" })
        .then((role) => {
          user.roles = [role._id];
          user
            .save()
            .then(() => {
              res.send({ status: "ok" });
            })
            .catch((err) => res.json(err));
        })
        .catch((err) => res.json(err));
    }
  };

  // [POST] /auth/signin
  signin = (req, res) => {
    User.findOne({ email: req.body.email })
      .populate("roles", "-__v")
      .then((user) => {
        if (!user)
          return res.send({
            accessToken: null,
            message: "email không tồn tại!!!",
          });
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          return res.send({
            accessToken: null,
            message: "mật khẩu không chính xác",
          });
        }

        const token = jwt.sign({ id: user.id }, process.env.AUTH_SECRET, {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: 86400,
        });
        var authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.send({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      })
      .catch((err) => console.log(err));
  };
}

module.exports = new AuthController();
