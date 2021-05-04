// -------------------------------------------------
//                 DEPENDANCIES
// -------------------------------------------------
var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
var middleware=require("../middleware/index.js");

// -------------------------------------------------
//                  ROUTES
// -------------------------------------------------

// Index Page
router.get("/",function(req,res){
    res.render("landing");
});

// -------------------------------------------------
//                 AUTHENTICATION ROUTES
// -------------------------------------------------

// show register form
router.get("/register",function(req,res){
    res.render("register");
}); 

// Handle Signup logic
router.post("/register",function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            return res.render("register");
        } else {
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to YelpCamp "+user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

// Show Login form
router.get("/login",function(req,res){
    res.render("login");
});

// Handling login logic
// app.post(route , middleware , callback);
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), function(req,res){
        // This is the callback function
});
// Logout route
router.get("/logout",function(req,res){
    req.logout();
    // flash message
    req.flash("success","You have successfully Logged out!");
    res.redirect("/campgrounds");
});

module.exports=router;