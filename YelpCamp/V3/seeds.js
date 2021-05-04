var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

var data=[
    {
        name:"First Post",
        image:"/Images/img1.jpg",
        description:"Blah blah blah blah"
    },
    {
        name:"Second Post",
        image:"/Images/img2.jpg",
        description:"Blah blah blah blah"
    },
    {
        name:"Third Post",
        image:"/Images/img3.jpg",
        description:"Blah blah blah blah"
    },
    {
        name:"Fourth Post",
        image:"/Images/img4.jpg",
        description:"Blah blah blah blah"
    }
]


function seedDB(){
    // Remove all campgrounds
    Campground.deleteMany({},function(err){
        if(err){
            console.log(err);
        }
        // console.log("removed campgrounds!!!");
        // Add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err){
                    console.log(err);
                } else {
                    // console.log("Added a new campground");
                    // create a comment
                    Comment.create({
                        text:"I wish there was internet",
                        author:"Homer"
                    },function(err,comment){
                        if(err){
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            // console.log("Created new comment");
                        }
                    });
                }
            });
        });
    });
}

module.exports=seedDB;