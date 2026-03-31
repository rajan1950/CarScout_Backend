const express = require("express");

const {
  addToWishlist,
  getAllWishlistItems,
  getUserWishlist,
  removeFromWishlist,
  deleteWishlistItemById
} = require("../controller/WishlistController");

const router = express.Router();

router.post("/add", addToWishlist);
router.get("/all", getAllWishlistItems);
router.get("/user/:userId", getUserWishlist);
router.delete("/remove", removeFromWishlist);
router.delete("/:id", deleteWishlistItemById);

module.exports = router;