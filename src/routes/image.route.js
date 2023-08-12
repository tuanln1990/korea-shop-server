const express = require("express");
const router = express.Router();
const multer = require("multer");
const imageController = require("../app/controllers/image.controller");
const upload = multer({ dest: "./src/public/uploads/images/" });

router.delete("/", imageController.deleteSingle);
router.delete("/images", imageController.deleteMore);
router.post("/", upload.single("image"), imageController.uploadSingle);

module.exports = router;
