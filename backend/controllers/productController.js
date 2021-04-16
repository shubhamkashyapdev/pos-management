import path from 'path';
import express from 'express';

import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import ErrorResponse from '../utils/errorResponse.js';

// desc     fetch all products
// req      GET /api/products
// access   public
export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({});
  res.status(200).json({
    successs: true,
    status: 200,
    count: products.length,
    data: products,
  });
});

// @desc     fetch single product
// @req      GET /api/products/:id
// @access   public
export const getSingleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.status(200).json({
      success: true,
      status: 200,
      data: product,
    });
  } else {
    return next(new ErrorResponse(`No Product Found`, 404));
  }
});

// @desc        add product
// @route       POST   /api/products
// @access      Private
export const addProduct = asyncHandler(async (req, res, next) => {
  // check for published bootcamp //
  const publishedProduct = await Product.findOne({ user: req.user.id });
  // if the user is not an admin,they can only add one product //
  console.log(req.body.user);
  if (publishedProduct && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The User With ID ${req.user.id} Has Already Published A Bootcamp`,
        400
      )
    );
  }
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    statu: 200,
    data: product,
  });
});

// @desc        Update product by id
// @route       PUT   /api/products/:id
// @access      Private
export const updateProductById = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse('No Product Found With Id Of ' + req.params.id, 404)
    );
  }
  // make sure user is product owner or admin //
  if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} Is Not Authorized To Update This product`,
        401
      )
    );
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    status: 200,
    data: product,
  });
});

// @desc        Delete product by id
// @route       PUT   /api/v1/products/:id
// @access      Private
export const deleteProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`No Bootcamp Found With Id Of ${req.params.id}`, 404)
    );
  }
  // make sure user is product owner //
  if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} Is Not Authorized To Delete This Product`,
        401
      )
    );
  }
  await product.remove();
  // request is accepted no further action is required //
  res.status(200).json({
    success: true,
    status: 200,
    data: {},
    msg: 'Product Deleted...',
  });
});

// @desc        Upload photo for product
// @route       PUT   /api/products/:id/image
// @access      Private
export const productPhotoUpload = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse('No Product Found With Id Of ' + req.params.id, 404)
    );
  }
  // make sure user is product owner //
  if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} Is Not Authorized To Update This Product`,
        401
      )
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;
  // Make sure file is a image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // create custom filename
  file.name = `photo_${product._id}${path.parse(file.name).ext}`;
  console.log(`${process.env.FILE_UPLOAD_PATH}/${file.name}`.green.inverse);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`));
    }
    await Product.findByIdAndUpdate(req.params.id, { image: file.name });

    res.status(200).json({
      success: true,
      status: 200,
      data: file.name,
    });
  });
});
