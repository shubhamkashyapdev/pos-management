import Review from '../models/reviewModel.js';
// imports //
import asyncHandler from 'express-async-handler';
import ErrorResponse from '../utils/errorResponse.js';
import Product from '../models/productModel.js';
// @desc        Get all Reviews | product reviews
// @route       GET   /api/reviews
// @route       GET   /api/products/:productId/reviews
// @access      Public

export const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.productId) {
    const reviews = await Review.find({ bootcamp: req.params.productId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    const reviews = await Review.find({});
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  }
});

// @desc        Get Review
// @route       GET   /api/reviews/:id
// @access      Public

export const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'product',
    select: 'name description',
  });
  if (!review) {
    return next(
      new ErrorResponse(`No review found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc        Post Review
// @route       POST   /api/products/:productId/reviews
// @access      Private

export const addReview = asyncHandler(async (req, res, next) => {
  req.body.product = req.params.productId;
  req.body.user = req.user.id;
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(
      new ErrorResponse(
        `No product found with the id of ${req.params.productId}`,
        404
      )
    );
  }
  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc        Put Review
// @route       PUT   /api/v1/reviews/:id
// @access      Private

export const updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }
  // make sure review belongs to user or user is an admin //

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update the review`, 401));
  }
  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updatedReview,
  });
});

// @desc        Delete Review
// @route       DELETE   /api/v1/reviews/:id
// @access      Private

export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }
  // make sure review belongs to user or user is an admin //

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete the review`, 401));
  }
  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
