const fs = require("fs");
const path = require("path");
const multer = require("multer");

/* CREATE FOLDER IF NOT EXISTS */
const uploadDir = path.join(__dirname, "../uploads/mentor-docs");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* MULTER STORAGE */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

/* FILE FILTER */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
