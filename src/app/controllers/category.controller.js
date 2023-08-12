const path = require("path");
const Category = require("../models/Category.model");
const fs = require("fs");
class CategoryController {
  // [GET] category/
  index(req, res) {
    console.log("get category...");
    let categoryQuery = Category.find({}).populate("parentCategory", "name");

    if (req.query.hasOwnProperty("_sort")) {
      categoryQuery = categoryQuery.sort({
        [req.query.col]: [req.query.type],
      });
    }
    Promise.all([
      categoryQuery,
      Category.countDocumentsWithDeleted({ deleted: true }),
    ])
      .then(([categories, deletedCount]) => {
        res.send({ categories, deletedCount });
      })
      .catch((errors) => console.log(errors));
  }

  // [GET] category/trash
  trash(req, res) {
    console.log("get trash categories");

    Category.findWithDeleted({ deleted: true })
      .populate("parentCategory", "name")
      .then((categories) => res.json(categories))
      .catch((error) => console.log(error));
  }

  // [POST] category/
  async create(req, res) {
    console.log("create category...");
    console.log(req.file);
    const errorList = [];
    if (!req.body.name) errorList.push("name is required!!!");
    if (!req.file) errorList.push("image is required!!!");
    req.body.image = req.file.path.split("\\").splice(2).join("\\");
    if (errorList.length) {
      res.send(errorList);
      return;
    }
    Category.create(req.body)
      .then(() => setTimeout(() => res.send({ status: "ok" }), 200))
      .catch((err) => console.log(err));
  }

  // [DELETE] category/:id
  async delete(req, res) {
    console.log("delete category...");
    Category.delete({ _id: req.params.id })
      .then(res.json("delete sucessfull"))
      .catch((err) => console.log(err));
  }
  // [DELETE] category/handle-actions
  async handleAction(req, res) {
    console.log("delete action...", req.body);
    Category.delete({ _id: { $in: req.body } })
      .then(() => {
        res.send({ status: "ok" });
      })
      .catch((errors) => console.log(errors));
  }

  // [DELETE] category/trash/:id
  async deleteForce(req, res) {
    console.log("Delete force category");
    const category = await Category.findOneWithDeleted({ _id: req.params.id });
    Category.deleteOne({ _id: req.params.id })
      .then(() => {
        try {
          fs.unlinkSync(
            path
              .join(__dirname, category.image)
              .replace("app\\controllers", "public")
          );
          res.json("Delete sucessfull");
        } catch (errors) {
          console.log(errors);
          res.json(error);
        }
      })
      .catch((errors) => console.log(errors));
  }

  // [POST] category/trash/:id
  async restore(req, res) {
    console.log("Khôi phục danh mục: ");
    Category.restore({ _id: req.params.id })
      .then(res.send("Khôi phục thành công"))
      .catch((errors) => console.log(errors));
  }

  // [POST] category/trash/handle-actions
  async handleActionTrash(req, res) {
    console.log("handle action trash Categories");
    switch (req.body.action) {
      case "delete":
        const categories = await Category.findWithDeleted({
          _id: { $in: req.body.data },
        });
        Category.deleteMany({ _id: { $in: req.body.data } })
          .then(() => {
            try {
              categories.map((category) => {
                fs.unlinkSync(
                  path
                    .join(__dirname, category.image)
                    .replace("app\\controllers", "public")
                );
              });
            } catch (errors) {
              console.log(errors);
              res.json(errors);
            }
            res.send({ status: "ok" });
          })
          .catch((errors) => console.log(errors));
        break;
      case "restore":
        Category.restore({ _id: { $in: req.body.data } })
          .then(res.json("Restore many sucessfull"))
          .catch((errors) => console.log(errors));
      default:
        break;
    }
  }

  // [PUT] category/:_id
  async edit(req, res) {
    console.log("Edit category: ", req.params);
    const category = await Category.findOne({ _id: req.params._id });
    category.name = req.body.name;
    if (req.file)
      category.image = req.file.path.split("\\").splice(2).join("\\");
    // if (req.body.parentCategory)
    category.parentCategory = req.body.parentCategory;
    category
      .save()
      .then(() => res.send({ status: "ok" }))
      .catch((errors) => {
        console.log(errors);
      });
  }
}

module.exports = new CategoryController();
