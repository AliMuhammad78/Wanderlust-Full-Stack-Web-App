const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
// const Review = require("../models/review.js")


const MongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MongoUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
 initData.data =  initData.data.map((obj)=> ({ ...obj , owner : "691eb1dd198c702bf6059a83"})) ;
  await Listing.insertMany(initData.data);
 

  console.log("data was initialized");
};

initDB();