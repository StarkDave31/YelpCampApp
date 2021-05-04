// -------------------------------------------------
//                 DEPENDANCIES
// -------------------------------------------------
var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware/index.js");


// -------------------------------------------------
//                 COMMENT ROUTES
// -------------------------------------------------
// Comment new
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.render("comments/new",{campground:campground});
        }
    });
});

// Comment Create
router.post("/",middleware.isLoggedIn,function(req,res){
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
                    // flash message
                    req.flash("success","Comment added Successfully");
                    // redirect back to show page
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
            
        }
    });
});
// Edit route for comments
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit.ejs",{campgroundId:req.params.id,comment:foundComment});
        }
    });
});

// Update route for comments
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// Destroy Route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    // find by Id and delete
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        } else {
            // flash message
            req.flash("success","Comment removed successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports=router;