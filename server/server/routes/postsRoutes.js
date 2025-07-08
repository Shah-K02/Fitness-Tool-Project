const express = require("express");
const multer = require("multer");
const postsController = require("../controllers/postsController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const date = new Date().toISOString().replace(/:/g, "-"); // Replacing colons
    cb(null, date + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
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
  "/",
  authenticate,
  upload.single("image"),
  postsController.createPost
); // Create a post
router.get("/", authenticate, (req, res) => {
  postsController.getAllPosts(req, res);
}); // Fetch all posts
router.get("/:postId", authenticate, postsController.getPostById); // Fetch a single post by ID
router.delete("/:postId", authenticate, postsController.deletePost); // Delete a post by ID
router.post("/:postId/comments", authenticate, postsController.createComment); // Create a comment
router.get(
  "/:postId/comments",
  authenticate,
  postsController.getCommentsByPostId
); // Fetch all comments for a post
router.post("/:postId/like", authenticate, postsController.likePost); // Like a post
router.get("/:postId/likes", authenticate, postsController.getLikeCount); // Get like count
router.delete("/:postId/unlike", authenticate, postsController.unlikePost); // Unlike a post
module.exports = router;
