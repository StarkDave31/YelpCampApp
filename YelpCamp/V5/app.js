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

// -------------------------------------------------
//                Route  Dependancies
// -------------------------------------------------
var commentRoutes     =require("./routes/comments"),
    campgroundRoutes  =require("./routes/campgrounds"),
    indexRoutes        =require("./routes/index");



app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true, useUnifiedTopology: true});

// Seeding the database  ----  Starter Data
// seedDB();

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

// Use the three route files
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


// App listen Property
app.listen(8154,"localhost",function(){
    console.log("Starting Yelpcamp Server at port 8154....");
});