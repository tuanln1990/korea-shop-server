const categoryRouter = require("./category.route");
const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const productRouter = require("./product.route");
const imageRouter = require("./image.route");
const linkList = `
    <h1>List API</h1>
    <a href='/category'>Category</a>
    <br/>
    <a href='/product'>Product</a>
  `;

function route(app) {
  app.use(function (req, res, next) {
    req.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.use("/image", imageRouter);
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/category", categoryRouter);
  app.use("/product", productRouter);
  app.use("/", (req, res) => {
    res.send(linkList);
  });
}

module.exports = route;
