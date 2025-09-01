const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Allowed MIME types
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileUploader = (folderName, fields) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join("public", folderName);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname) || ".jpeg";
      const fileName = `${folderName}-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;
      cb(null, fileName);
    },
  });

  // File filter for allowed types
  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only image files are allowed."), false);
    }
  };

  // Set size limit (e.g., 2MB max)
  const limits = {
    fileSize: 10 * 1024 * 1024, // 2 MB
  };

  return multer({ storage, fileFilter, limits }).fields(fields);
};

module.exports = fileUploader;



// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// const fileUploader = (folderName, fields) => {
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       const uploadPath = path.join("public", folderName);
//       if (!fs.existsSync(uploadPath)) {
//         fs.mkdirSync(uploadPath, { recursive: true });
//       }
//       cb(null, uploadPath);
//     },
//     filename: function (req, file, cb) {
//       const ext = path.extname(file.originalname) || ".jpeg";
//       const fileName = `${folderName}-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;
//       cb(null, fileName);
//     },
//   });

//   return multer({ storage }).fields(fields);
// };

// module.exports = fileUploader;
