// -------------------------------------------------
//                 DEPENDANCIES
// -------------------------------------------------
var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");


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
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req,res,function(){
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
    res.redirect("/campgrounds");
});

// =====================================================
//                    MIDDLEWARE
// =====================================================
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports=router;