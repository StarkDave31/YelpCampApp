// -------------------------------------------------
//                 DEPENDANCIES
// -------------------------------------------------

var Campground=require("../models/campground");
var Comment   =require("../models/comment");

// =============================================
//              MIDDLEWARES
// =============================================

var middlewareObj={};
// MIDDLEWARE TO CHECK THE USER'S OWNERSHIP
middlewareObj.checkCampgroundOwnership = function(req,res,next){
    // is user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash("error","404!Not Found!! :(");
                res.redirect("back");
            } else {
                // if logged in is the user owns the campgroud?
                // can't use === as foundCampground.author.id is an object and req.user._id is a String so .equals() method is used
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    // flash message
                    req.flash("error","You don't have permission to do that!");
                    // Otherwise redirect
                    res.redirect("back");
                }
            }
        });
    } else {
        // flash message
        req.flash("error","You need to be Logged In first!");
        // if not redirect
        // 'back' takes back the user to the page they came from
        res.redirect("back");
    }
};

// MIDDLEWARE TO CHECK THE USER'S COMMENT OWNERSHIP
middlewareObj.checkCommentOwnership = function(req,res,next){
    // is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","404!Not Found!! :(");
                res.redirect("back");
            } else {
                // if logged in is the user owns the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    // flash message
                    req.flash("error","You don't have permission to do that!");
                    // Otherwise redirect
                    res.redirect("back");
                }
            }
        });
    } else {
        // flash message
        req.flash("error","You need to be Logged In first!");
        // if not redirect
        // 'back' takes back the user to the page they came from
        res.redirect("back");
    }
};

// Check if the user is logged in or not
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        // flash message
        req.flash("error","You need to be Logged In first");
        // redirect
        res.redirect("/login");
    }
};


module.exports=middlewareObj;