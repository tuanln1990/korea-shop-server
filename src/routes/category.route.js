const express = require("express");
const router = express.Router();
const categoryController = require("../app/controllers/category.controller");
const multer = require("multer");
const upload = multer({ dest: "./src/public/uploads/images/" });

router.post("/trash/handle-actions", categoryController.handleActionTrash);
router.post("/trash/:id", categoryController.restore);
router.delete("/trash/:id", categoryController.deleteForce);
router.get("/trash", categoryController.trash);
router.delete("/handle-actions", categoryController.handleAction);
router.delete("/:id", categoryController.delete);
router.put("/:_id", upload.single("image"), categoryController.edit);
router.get("/", categoryController.index);
router.post("/", upload.single("image"), categoryController.create);

module.exports = router;
