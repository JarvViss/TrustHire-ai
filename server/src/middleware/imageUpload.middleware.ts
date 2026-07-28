import multer from "multer";
import path from "path";
import fs from "fs";

const imageDir = "uploads/images";

if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const imageStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, imageDir);
  },

  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, WebP, GIF images allowed"));
    }

    cb(null, true);
  },
});

export default imageUpload;
