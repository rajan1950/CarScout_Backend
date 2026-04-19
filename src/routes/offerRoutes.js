const express = require("express");

const {
  createOffer,
  getOffers,
  updateOffer
} = require("../controller/offerController");

const validateToken = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/create", validateToken, createOffer);
router.get("/my", validateToken, getOffers);
router.patch("/:id", validateToken, updateOffer);

module.exports = router;