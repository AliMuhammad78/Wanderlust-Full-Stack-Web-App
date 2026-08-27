const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isloggedIn , isOwner , validateListing} = require("../middleware.js") ;
 const listingController = require("../controllers/listings.js")
 const multer = require("multer");
   
  const { upload, uploadToCloudinary } = require("../cloudConfig.js");


 router.route("/")
 .get(wrapAsync(listingController.index))
//  .post(
//     isloggedIn,
//   validateListing , 
//   wrapAsync(listingController.createListing))
  .post(
  isloggedIn,
  validateListing,
  upload.single("listing[image]"),
  wrapAsync(listingController.createListing)
);



// new route 
router.get("/new" , isloggedIn , listingController.newForm) ;


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(validateListing ,
  isloggedIn,
  isOwner,
  wrapAsync(listingController.updateListing))
.delete(
    isloggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);






// index route
// router.get("/" ,  wrapAsync(listingController.index))
 

 
// show route 
// router.get("/:id" , wrapAsync(listingController.showListing)) ;

// create route
// router.post("/" , 
//     isloggedIn,
//   validateListing , 
//   wrapAsync(listingController.createListing)
// )


//Edit Route
router.get("/:id/edit", 
    isloggedIn,
    isOwner,
    wrapAsync(listingController.editForm));

//Update Route
// router.put("/:id", 
//   validateListing ,
//   isloggedIn,
//   isOwner,
//   wrapAsync(listingController.updateListing));




//Delete Route
// router.delete("/:id", 
//     isloggedIn,
//     isOwner,
//     wrapAsync(listingController.deleteListing));


module.exports = router ; 