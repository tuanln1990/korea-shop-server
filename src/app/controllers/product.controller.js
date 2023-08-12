const path = require("path");
const Product = require("../models/Product.model");
const fs = require("fs");
class ProductController {
  // [GET] product/
  index(req, res) {
    console.log("get product...");
    let productQuery = Product.find({}).populate("category", "name");

    if (req.query.hasOwnProperty("_sort")) {
      productQuery = productQuery.sort({
        [req.query.col]: [req.query.type],
      });
    }
    Promise.all([
      productQuery,
      Product.countDocumentsWithDeleted({ deleted: true }),
    ])
      .then(([products, deletedCount]) => {
        res.send({ products, deletedCount });
      })
      .catch((errors) => console.log(errors));
  }

  // [GET] product/trash
  trash(req, res) {
    console.log("get trash products");

    Product.findWithDeleted({ deleted: true })
      .populate("category", "name")
      .then((products) => res.json(products))
      .catch((error) => console.log(error));
  }

  // [POST] product/
  async create(req, res) {
    console.log("create product...");
    const errorList = [];
    if (!req.body.name) errorList.push("name is required!!!");
    if (!req.files.avatar.length) errorList.push("Avatar is required!!!");
    if (!req.body.price) errorList.push("Price is required!!");
    if (errorList.length) {
      res.send(errorList);
      return;
    }
    req.body.avatar = req.files.avatar[0].path.split("\\").splice(2).join("\\");
    if (req.files["imageList[]"]) {
      req.body.imageList = [];
      req.files["imageList[]"].map((image) => {
        req.body.imageList.push(image.path.split("\\").splice(2).join("\\"));
      });
    }
    Product.create(req.body)
      .then(() => res.send({ status: "ok" }))
      .catch((err) => console.log(err));
  }

  // [DELETE] product/:id
  async delete(req, res) {
    console.log("delete product...");
    Product.delete({ _id: req.params.id })
      .then(res.json("delete sucessfull!"))
      .catch((err) => console.log(err));
  }
  // [DELETE] product/handle-actions
  async handleAction(req, res) {
    console.log("delete action...");
    Product.delete({ _id: { $in: req.body } })
      .then(() => res.send({ status: "ok" }))
      .catch((errors) => console.log(errors));
  }

  // [DELETE] product/trash/:id
  async deleteForce(req, res) {
    console.log("Delete force product");
    const product = await Product.findOneWithDeleted({ _id: req.params.id });
    Product.deleteOne({ _id: req.params.id })
      .then(() => {
        try {
          fs.unlinkSync(
            path
              .join(__dirname, product.avatar)
              .replace("app\\controllers", "public")
          );
          if (product.imageList) {
            product.imageList.forEach((image) => {
              fs.unlinkSync(
                path
                  .join(__dirname, image)
                  .replace("app\\controllers", "public")
              );
            });
          }
          res.json("Xóa thành công");
        } catch (errors) {
          console.log(errors);
          res.json(errors);
        }
      })
      .catch((errors) => console.log(errors));
  }

  // [POST] product/trash/:id
  async restore(req, res) {
    console.log("Khôi phục danh mục: ");
    Product.restore({ _id: req.params.id })
      .then(res.send("Khôi phục thành công"))
      .catch((errors) => console.log(errors));
  }

  // [POST] product/trash/handle-actions
  async handleActionTrash(req, res) {
    console.log("handle action trash Products");

    switch (req.body.action) {
      case "delete":
        const products = await Product.findWithDeleted({
          _id: { $in: req.body.data },
        });
        Product.deleteMany({ _id: { $in: req.body.data } })
          .then(() => {
            try {
              products.forEach((product) => {
                fs.unlinkSync(
                  path
                    .join(__dirname, product.avatar)
                    .replace("app\\controllers", "public")
                );
                if (product.imageList) {
                  product.imageList.forEach((image) => {
                    fs.unlinkSync(
                      path
                        .join(__dirname, image)
                        .replace("app\\controllers", "public")
                    );
                  });
                }
              });
              res.json("Force delete many sucessfull");
            } catch (errors) {
              console.log(errors);
              res.json(errors);
            }
          })
          .catch((errors) => console.log(errors));
        break;
      case "restore":
        Product.restore({ _id: { $in: req.body.data } })
          .then(res.json("Restore many sucessfull"))
          .catch((errors) => console.log(errors));
      default:
        break;
    }
  }

  // [PUT] product/:_id
  async edit(req, res) {
    console.log("Edit product: ", req.params);
    const product = await Product.findOne({ _id: req.params._id });
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    if (req.body.category) product.category = req.body.category;
    if (req.files.avatar)
      product.avatar = req.files.avatar[0].path
        .split("\\")
        .splice(2)
        .join("\\");
    if (req.files["imageList[]"]) {
      req.files["imageList[]"].forEach((image) => {
        if (req.body.imageList instanceof Array) {
          req.body.imageList.push(image.path.split("\\").splice(2).join("\\"));
        } else {
          req.body.imageList = [image.path.split("\\").splice(2).join("\\")];
        }
      });
    }
    product.imageList = req.body.imageList;
    product.save();
    res.send({ status: "ok" });
  }
  catch(errors) {
    console.log(errors);
    res.json(errors);
  }
}

module.exports = new ProductController();
