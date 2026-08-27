const User = require("../models/user") ;


module.exports.renderSinupForm = (req , res)=>{
  res.render("users/signup.ejs") ;
}
 

module.exports.signupUser = async (req , res)=>{
   try{
    const {username , email , password} = req.body ;
    const newUser = new User({email , username});
    const registeredUser = await User.register(newUser , password);
    console.log(registeredUser);
    req.flash("success" , "Welcome to the Wanderlust!") ;
    res.redirect("/listings") ;
    // res.send(registeredUser);
   }catch(e){
    //    console.log(e);
    req.flash("error" , e.message) ;
    res.redirect("/signup") ;
   }
}

module.exports.renderLoginForm =  (req , res)=>{
  res.render("users/login.ejs") ;
}

module.exports.loginUser = async (req , res)=>{
  req.flash("success" , "Welcome back! to the Wanderlust") ;
  let redirectUrl = res.locals.redirectUrl || "/listings" ;
  res.redirect(redirectUrl) ;
// res.send("logged in successfully") ;
}

module.exports.logoutUser = (req , res, next)=>{
  req.logout((err)=>{
    if(err){
       return next(err) ;
    }
    req.flash("success" , "Logged you out!") ;
    res.redirect("/listings") ;
  });
}