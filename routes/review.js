const express = require('express');
const mongoose = require("mongoose");
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
// const{listingSchema , reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js"); 
const { validateReview , isloggedIn, isReviewAuthor } = require("../middleware.js") ;
// const ExpressError = require("../utils/ExpressError.js")

const reviewController = require("../controllers/reviews.js") ;


//Reviews 
// Post Review rout
router.post("/" ,
   validateReview ,
   isloggedIn ,
   wrapAsync(reviewController.createReview)
  ) ;

// Delete Review Route 
router.delete("/:reviewId" ,
  isloggedIn ,
  isReviewAuthor , 
   wrapAsync(reviewController.deleteReview) )

module.exports = router ;