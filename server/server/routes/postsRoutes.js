const express = require("express");
const multer = require("multer");
const postsController = require("../controllers/postsController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Configure Multer (You might want to move this to a separate file for cleaner code)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this uploads directory exists
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
  fileFilter: fileFilter,
});

router.post(
  "/posts",
  authenticate,
  upload.single("image"),
  postsController.createPost
);

// Creating a post with an image
router.post(
  "/posts",
  authenticate,
  upload.single("image"),
  postsController.createPost
);
// Fetching all posts
router.get("/posts", authenticate, postsController.getAllPosts);

// Additional routes can be added here for updating, deleting, etc.
// Example: Fetching a single post
router.get("/posts/:postId", authenticate, postsController.getPostById);

// Example: Deleting a post
router.delete("/posts/:postId", authenticate, postsController.deletePost);

module.exports = router;
