const express = require("express");
const router = express.Router();
const productController = require("../app/controllers/product.controller");
const multer = require("multer");
const upload = multer({ dest: "./src/public/uploads/images" });

router.post("/trash/handle-actions", productController.handleActionTrash);
router.post("/trash/:id", productController.restore);
router.delete("/trash/:id", productController.deleteForce);
router.get("/trash", productController.trash);
router.delete("/handle-actions", productController.handleAction);
router.delete("/:id", productController.delete);
router.put(
  "/:_id",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "imageList[]", maxCount: 9 },
  ]),
  productController.edit
);
router.get("/", productController.index);
router.post(
  "/",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "imageList[]", maxCount: 9 },
  ]),
  productController.create
);

module.exports = router;
