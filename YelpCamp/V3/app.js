// -------------------------------------------------
//                  Dependancies
// -------------------------------------------------
var express           =require("express"),
    app               =express(),
    ejs               =require("ejs"),
    mongoose          =require("mongoose"),
    bodyParser        =require("body-parser"),
    Campground        =require("./models/campground"),
    Comment           =require("./models/comment"),
    seedDB            =require("./seeds");


app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true, useUnifiedTopology: true});
seedDB();


// -------------------------------------------------
//                  ROUTES
// -------------------------------------------------

// Index Page
app.get("/",function(req,res){
    res.render("landing");
});

// Campgrounds Page
app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    });
});

app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
});

app.post("/campgrounds",function(req,res){
    // Push data in the database 
    var newCampground={name:req.body.name, image:req.body.image, description:req.body.description};
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
app.get("/campgrounds/:id",function(req,res){
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

// -------------------------------------------------
//                 COMMENT ROUTES
// -------------------------------------------------

app.get("/campgrounds/:id/comments/new",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.render("comments/new",{campground:campground});
        }
    });
});

app.post("/campgrounds/:id/comments",function(req,res){
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
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect back to show page
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
            
        }
    });
});


// App listen Property
app.listen(8154,"localhost",function(){
    console.log("Starting Yelpcamp Server at port 8154....");
});