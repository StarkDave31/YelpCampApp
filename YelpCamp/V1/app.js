// -------------------------------------------------
//                  Dependancies
// -------------------------------------------------
var express        =require("express"),
    ejs            =require("ejs"),
    bodyParser     =require("body-parser");

var app=express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


var campgrounds=[
    {name:"Steve Jobs",image:"/Images/img1.jpg"},
    {name:"Knowledge and Human",image:"/Images/img2.jpg"},
    {name:"World of Computer",image:"/Images/img3.jpg"},
    {name:"Ethernet",image:"/Images/img4.jpg"},
    {name:"Mathematics!!",image:"/Images/img5.jpg"},
    {name:"The New World",image:"/Images/img6.jpg"},
    {name:"Steve Jobs",image:"/Images/img1.jpg"},
    {name:"Knowledge and Human",image:"/Images/img2.jpg"},
    {name:"World of Computer",image:"/Images/img3.jpg"},
    {name:"Ethernet",image:"/Images/img4.jpg"},
    {name:"Mathematics!!",image:"/Images/img5.jpg"},
    {name:"The New World",image:"/Images/img6.jpg"}
]

// -------------------------------------------------
//                  ROUTES
// -------------------------------------------------

// Index Page
app.get("/",function(req,res){
    res.render("landing");
});

// Campgrounds Page
app.get("/campgrounds",function(req,res){
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.get("/campgrounds/new",function(req,res){
    res.render("new");
});

app.post("/campgrounds",function(req,res){
    // Push data in the database 
    var newCampground={name:req.body.name, image:req.body.image};
    campgrounds.push(newCampground);
    // redirect
    res.redirect("/campgrounds");
    
});







// App listen Property
app.listen(8154,"localhost",function(){
    console.log("Starting Yelpcamp Server at port 8154....");
});