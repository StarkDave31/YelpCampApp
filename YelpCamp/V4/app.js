// -------------------------------------------------
//                  Dependancies
// -------------------------------------------------
var express           =require("express"),
    app               =express(),
    ejs               =require("ejs"),
    mongoose          =require("mongoose"),
    bodyParser        =require("body-parser"),
    passport          =require("passport"),
    LocalStrategy     =require("passport-local"),
    Campground        =require("./models/campground"),
    Comment           =require("./models/comment"),
    User              =require("./models/user"),
    seedDB            =require("./seeds");


app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true, useUnifiedTopology: true});
seedDB();

// -------------------------------------------------
//                  PASSPORT CONFIGURATION
// -------------------------------------------------
app.use(require("express-session")({
    secret:"I love my family!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// APP.USE MIDDLEWARES
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

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

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.render("comments/new",{campground:campground});
        }
    });
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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

// -------------------------------------------------
//                 AUTHENTICATION ROUTES
// -------------------------------------------------

// show register form
app.get("/register",function(req,res){
    res.render("register");
}); 

// Handle Signup logic
app.post("/register",function(req,res){
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
app.get("/login",function(req,res){
    res.render("login");
});

// Handling login logic
// app.post(route , middleware , callback);
app.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), function(req,res){
        // This is the callback function
});
// Logout route
app.get("/logout",function(req,res){
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

// App listen Property
app.listen(8154,"localhost",function(){
    console.log("Starting Yelpcamp Server at port 8154....");
});