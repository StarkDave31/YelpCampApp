// -------------------------------------------------
//                 DEPENDANCIES
// -------------------------------------------------
var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");

// -------------------------------------------------
//                 CAMPGROUND ROUTES
// -------------------------------------------------
// Campgrounds Page
router.get("/",function(req,res){
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    });
});

router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

// CREATE- Add a new campground to the DataBase
router.post("/",isLoggedIn,function(req,res){
    // Push data in the database 
    var name=req.body.name;
    var image=req.body.image
    var desc=req.body.description
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground={name:name, image:image, description:desc,author:author};
    Campground.create(newCampground,function(err,newlycreated){
        if(err){
            res.redirect("/");
        } else {
            // redirect
            res.redirect("/campgrounds");
        }
    });  
});

// Show Template
router.get("/:id",function(req,res){
    // Find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            res.redirect("/campground");
        } else {
            // render the template 
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
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