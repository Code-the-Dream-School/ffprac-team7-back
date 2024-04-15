const multer = require("multer");

// file types allowed
const allowedFileTypes = ["image/jpeg", "image/png"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
  fileFilter: function (req, file, cb) {
    // check for the allowed file type
    if (!allowedFileTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG and PNG files are allowed"), false);
    }

    cb(null, true);
  },
});

// file size limit of 5mb
const uploadLimits = {
  fileSize: 5 * 1024 * 1024,
};

const upload = multer({ storage, limits: uploadLimits });

module.exports = upload;
