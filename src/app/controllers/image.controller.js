const { json } = require("express");
const fs = require("fs");
const path = require("path");
class ImageController {
  //[POST] upload-single/
  async uploadSingle(req, res) {
    console.log("upload single image....");
    res.json(req.file.path.split("\\").splice(2).join("\\"));
  }

  // [DELETE] delete-single/
  async deleteSingle(req, res) {
    try {
      if (req.body.image)
        fs.unlinkSync(
          path
            .join(__dirname, req.body.image)
            .replace("app\\controllers", "public")
        );
      res.json("sucess");
    } catch (errors) {
      console.log(errors);
      res.json(errors);
    }
  }

  async deleteMore(req, res) {
    console.log("delete more");
    try {
      req.body.images.forEach((image) => {
        fs.unlinkSync(
          path.join(__dirname, image).replace("app\\controllers", "public")
        );
      });
      res.json("sucess");
    } catch (errors) {
      console.log(errors);
      res.json(errors);
    }
  }
}

module.exports = new ImageController();
