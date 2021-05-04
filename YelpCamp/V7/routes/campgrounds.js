// -------------------------------------------------
//                 DEPENDANCIES
// -------------------------------------------------
var express=require("express");
const campground = require("../models/campground");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware/index.js");

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

router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

// CREATE- Add a new campground to the DataBase
router.post("/",middleware.isLoggedIn,function(req,res){
    // Push data in the database 
    var name=req.body.name;
    var image=req.body.image;
    var price=req.body.price;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground={name:name, price:price, image:image, description:desc,author:author};
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

// Edit Campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});

// Update Campground Route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            // redirect somewhere(recommended:show page)
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// Destroy Campground Route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    // Find by ID and delete
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/");
        } else {
            // redirect somewhere
            res.redirect("/campgrounds");
        }
    });
});


module.exports=router;