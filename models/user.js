const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String ,
        required : true ,
         
    }
});

userSchema.plugin(passportLocalMongoose);
// this will add username , hash and salt fields to store username and the hashed password
// and also add some methods to the schema like register , authenticate etc 

module.exports = mongoose.model("User" , userSchema);