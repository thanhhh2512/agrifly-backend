const express = require("express");
const router = express.Router();
const fileUploader = require("../middlewares/upload");

router.post(
  "/cloudinary-upload",
  fileUploader.single("file"),
  (req, res, next) => {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    const newImage = new UploadedFile({
      title: req.file.filename,
      fileUrl: req.file.path,
    });
    newImage.save((err) => {
      if (err) {
        return res.status(500);
      }
      res.json({ secure_url: req.file.path });
    });
  }
);

module.exports = router;
