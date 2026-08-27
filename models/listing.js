const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
      url : String,
      filename : String 
      




   
    // type: String,
     
    // default:
    //   "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/24/9b/85/hotel-exterior.jpg?w=1200&h=-1&s=1",
    // set: (v) =>
    //   v === ""
    //     ? "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/24/9b/85/hotel-exterior.jpg?w=1200&h=-1&s=1"
    //     : v,

        // set is an arrow function with parameter v , next is ternary operator ,,,, if v= empty then link
        // else original v value
  },
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type : Schema.Types.ObjectId  , 
      ref : "Review"
    }
  ]  , 
  owner : {
    type : Schema.Types.ObjectId  , 
    ref : "User"
  }
});


//  to delete reviews when we delete listing 
listingSchema.post("findOneAndDelete" , async (listing)=>{
  if (listing) {
  await Review.deleteMany({_id : {$in: listing.reviews}});
  }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;