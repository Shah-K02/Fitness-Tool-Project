const crypto = require("crypto");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const postsController = require("../controllers/postsController");
const authenticate = require("../middleware/authenticate");
const config = require("../config");

const router = express.Router();

fs.mkdirSync(config.uploadsDir, { recursive: true });

// Allowed image types and the extension each is saved with. The client's
// file name is never used on disk, so it can't escape the uploads folder.
const IMAGE_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: config.uploadsDir,
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${IMAGE_TYPES[file.mimetype]}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 5 },
  fileFilter: (req, file, cb) => {
    if (IMAGE_TYPES[file.mimetype]) return cb(null, true);
    const err = new Error("Upload a JPEG, PNG, GIF or WebP image.");
    err.status = 400;
    err.expose = true;
    cb(err);
  },
});

// The declared type can be faked, so check the file's first bytes too.
const SIGNATURES = [
  (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff, // JPEG
  (b) => b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), // PNG
  (b) => b.slice(0, 4).toString("ascii") === "GIF8", // GIF
  (b) => b.slice(0, 4).toString("ascii") === "RIFF" && b.slice(8, 12).toString("ascii") === "WEBP", // WebP
];

const verifyImage = (req, res, next) => {
  if (!req.file) return next();
  const fd = fs.openSync(req.file.path, "r");
  const header = Buffer.alloc(12);
  fs.readSync(fd, header, 0, 12, 0);
  fs.closeSync(fd);
  if (SIGNATURES.some((matches) => matches(header))) return next();
  fs.unlink(req.file.path, () => {});
  res.status(400).json({ status: "fail", message: "That file isn't a valid image." });
};

const handleUpload = (req, res, next) =>
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        status: "fail",
        message: err.code === "LIMIT_FILE_SIZE" ? "Images must be 5 MB or smaller." : "Upload failed.",
      });
    }
    next(err);
  });

router.use(authenticate);

router.post("/", handleUpload, verifyImage, postsController.createPost);
router.get("/", postsController.getAllPosts);
router.get("/:postId", postsController.getPostById);
router.delete("/:postId", postsController.deletePost);
router.post("/:postId/comments", postsController.createComment);
router.get("/:postId/comments", postsController.getCommentsByPostId);
router.post("/:postId/like", postsController.likePost);
router.get("/:postId/likes", postsController.getLikeCount);
router.delete("/:postId/unlike", postsController.unlikePost);

module.exports = router;
