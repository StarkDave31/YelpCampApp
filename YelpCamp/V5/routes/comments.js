// -------------------------------------------------
//                 DEPENDANCIES
// -------------------------------------------------
var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");



// -------------------------------------------------
//                 COMMENT ROUTES
// -------------------------------------------------
// Comment new
router.get("/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.render("comments/new",{campground:campground});
        }
    });
});

// Comment Create
router.post("/",isLoggedIn,function(req,res){
    // lookup campground using ID
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save the comment
                    comment.save();
                    // connect new comment to campground
                    campground.comments.push(comment);
                    // save the campground
                    campground.save();
                    // redirect back to show page
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
            
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