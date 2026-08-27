 
  
 const express = require('express')
const app = express() ;
const port = 8080 ;
const mongoose = require("mongoose");
require('dotenv').config();

 

// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const MongoUrl = "mongodb://127.0.0.1:27017/wanderlust" ;
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
// const wrapAsync = require("./utils/wrapAsync.js");
// const{listingSchema , reviewSchema} = require("./schema.js");
const ejsMate = require("ejs-mate") ;
// const Review = require("./models/review.js");
// const { wrap } = require('module');
const passport = require("passport"); 
const LocalStrategy = require("passport-local");
const User = require("./models/user.js") ;

const listingRouters = require("./routes/listing.js") ;
const reviewRouters = require("./routes/review.js") ;
const userRouters = require("./routes/user.js") ; 


main().then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(err)
})

async function main() {
    mongoose.connect(MongoUrl)
}

app.set("view engine" , "ejs") ;
app.set("views" , path.join(__dirname , "views"))
app.use(express.urlencoded({extended : true}))
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate) ;
app.use(express.static(path.join(__dirname , "/public")))   // to use css files etc

const sessionOptions = {
    secret : "thisshouldbeabettersecret!" ,
    resave : false ,
    saveUninitialized : true ,
    cookie : {
      expires : Date.now() +  7* 24 * 60 * 60 *1000 ,
      maxAge : 7* 24 * 60 * 60 *1000 , 
      httpOnly : true ,
    }
} ; 

app.get('/', (req, res) => res.send('This is the root path')) ;


app.use(session(sessionOptions));
app.use(flash()); 





// passport config 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())) ;
// use static authentication methods added by passport-local-mongoose 
passport.serializeUser(User.serializeUser());
                // serializeUser determines which data of the user object should be stored in the session.
passport.deserializeUser(User.deserializeUser()); 
               // deserializeUser is the counterpart of serializeUser. It takes the data from the session and converts it back into a user object.


   app.use((req , res , next)=>{ 
  res.locals.success = req.flash("success") ;
  res.locals.error = req.flash("error") ;
res.locals.curUser = req.user ;
  next() ;
}) ;
 


// routes
app.use("/listings", listingRouters ) ;
app.use("/listings/:id/reviews" ,reviewRouters ) ;
app.use("/", userRouters ) ; 


 
 

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

 

app.use((err, req , res , next)=>{
  let {statusCode = 500 , message= "Something went wrong"} = err ; 
  res.status(statusCode).render("error.ejs" , {message})
// res.status(statusCode).send(message); 
 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 



