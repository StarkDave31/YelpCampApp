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
    methodOverride    =require("method-override"),
    flash             =require("connect-flash"),
    seedDB            =require("./seeds");

// -------------------------------------------------
//                Route  Dependancies
// -------------------------------------------------
var commentRoutes     =require("./routes/comments"),
    campgroundRoutes  =require("./routes/campgrounds"),
    indexRoutes       =require("./routes/index");



app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true, useUnifiedTopology: true});
app.use(methodOverride("_method"));
app.use(flash());

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
    // Set user data to currentUser so all templates can use that
    res.locals.currentUser = req.user;
    // set flash message data so all templates can use that
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
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