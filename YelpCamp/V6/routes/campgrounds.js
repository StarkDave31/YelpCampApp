// -------------------------------------------------
//                 DEPENDANCIES
// -------------------------------------------------
var express=require("express");
const campground = require("../models/campground");
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

// Edit Campground Route
router.get("/:id/edit",checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});

// Update Campground Route
router.put("/:id",checkCampgroundOwnership,function(req,res){
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
router.delete("/:id",checkCampgroundOwnership,function(req,res){
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


// =====================================================
//                    MIDDLEWARE
// =====================================================
// MIDDLEWARE TO CHECK IF THE USER IS LOGGED IN OR NOT
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}



// MIDDLEWARE TO CHECK THE USER'S OWNERSHIP
function checkCampgroundOwnership(req,res,next){
    // is user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("back");
            } else {
                // if logged in is the user owns the campgroud?
                // can't use === as foundCampground.author.id is an object and req.user._id is a String so .equals() method is used
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    // Otherwise redirect
                    res.redirect("back");
                }
            }
        });
    } else {
        // if not redirect
        // 'back' takes back the user to the page they came from
        res.redirect("back");
    }
}

module.exports=router;