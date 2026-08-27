
 const Listing = require("../models/listing.js") ;
 const { uploadToCloudinary } = require("../cloudConfig");

module.exports.index = (async (req , res) =>{
   
    const allListings = await Listing.find({} ) ;
    res.render("listings/index.ejs" , {allListings})
   
})

module.exports.newForm = (req ,res) =>{

    res.render("listings/new.ejs")
}

module.exports.showListing =   async (req ,res) =>{
    let {id} = req.params ;
   const listing = await  Listing.findById(id)
   .populate({ path: "reviews", 
               populate: { path: "author" }
               })
   .populate("owner") ;
   console.log("curUser:", req.user);
console.log("listing.owner:", listing.owner);

   if(!listing){
    req.flash("error" , "Cannot find that listing!") ;
    return res.redirect("/listings") ;
   }
   res.render("listings/show.ejs", {listing}) ;
}

 

module.exports.createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    //  If a file was uploaded, send it to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "listing-images",        // folder in Cloudinary
        req.body.listingTitle    // optional filename
      );

      // Save URL and filename in MongoDB
      newListing.image = {
        url: result.secure_url,
        filename: result.public_id
      };
    }
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};


module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error" , "Cannot find that listing!") ;
    return res.redirect("/listings") ;
  }
  res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
   
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , "Successfully updated the listing!") ;
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success" , "Successfully deleted the listing!") ;
  res.redirect("/listings");
}