const multer = require("multer");
const appError = require("./appError");
const storage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new appError(
        "Not an  image file ! Please upload only  image files.",
        400,
      ),
      false,
    );
  }
};
const multerUpload = multer({ storage: storage, fileFilter: multerFilter });
module.exports = { multerUpload };
