const Review = require("../models/ReviewModel");


// CREATE REVIEW
const createReview = async (req, res) => {
  try {

    const review = await Review.create(req.body);

    res.status(201).json({
      message: "Review Created",
      data: review
    });

  } catch (error) {
    res.status(500).json(error);
  }
};


// GET ALL REVIEWS
const getAllReviews = async (req, res) => {
  try {

    const reviews = await Review.find()
      .populate("userId")
      .populate("carId");

    res.json(reviews);

  } catch (error) {
    res.status(500).json(error);
  }
};


// GET REVIEW BY ID
const getReviewById = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id)
      .populate("userId")
      .populate("carId");

    res.json(review);

  } catch (error) {
    res.status(500).json(error);
  }
};


// UPDATE REVIEW
const updateReview = async (req, res) => {
  try {

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(review);

  } catch (error) {
    res.status(500).json(error);
  }
};


// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      message: "Review Deleted"
    });

  } catch (error) {
    res.status(500).json(error);
  }
};


module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
};