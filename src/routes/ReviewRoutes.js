const express = require("express");

const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
} = require("../controller/ReviewController");

const router = express.Router();

//localhost:5000/api/reviews/add
router.post("/add", createReview); 
//localhost:5000/api/reviews/all   
router.get("/all", getAllReviews); 
//localhost:5000/api/reviews/:id     
router.get("/:id", getReviewById); 
//localhost:5000/api/reviews/:id     
router.put("/:id", updateReview);
//localhost:5000/api/reviews/:id       
router.delete("/:id", deleteReview);  

module.exports = router;