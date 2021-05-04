// -------------------------------------------------
//                  Dependancies
// -------------------------------------------------
var express           =require("express"),
    ejs               =require("ejs"),
    mongoose          =require("mongoose"),
    bodyParser        =require("body-parser");

var app=express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// -------------------------------------------------
//                  Mongoose Setup
// -------------------------------------------------
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true, useUnifiedTopology: true});

var campgroundSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String
});

var Campground=mongoose.model("Campground",campgroundSchema);

// Campground.create(
//     {name:"Cloud's Rest",image:"/Images/img10.jpg",
// description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, "
//     }
// );

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
            res.render("index",{campgrounds:allcampgrounds});
        }
    });
});

app.get("/campgrounds/new",function(req,res){
    res.render("new");
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
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            res.redirect("/campground");
        } else {
            // render the template 
            res.render("show",{campground:foundCampground});
        }
    });
});






// App listen Property
app.listen(8154,"localhost",function(){
    console.log("Starting Yelpcamp Server at port 8154....");
});