var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request")

// var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = 8080

var app = express();

app.use(logger("dev"));
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));

// var databaseUrl = "mongo_scrape"
// var collection = ["articles"];

// var db = mongojs(databaseUrl, collection);

// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongo-scrape", {
  useMongoClient:  true
});

app.get("/scrape", function(req, res){

  // axios.get("https://www.nytimes.com/").then(function(response) {
    
url = "https://www.nytimes.com/"

request(url, function(error, response, html){
.then(function(response) {

    if(!error){
  
    var $ = cheerio.load(response.html);

 $('h2.story-heading').filter(function(){
    //             var data = $(this);d
    // $("h2.story-heading").each(function(i, element) {

       var results = {};

        results.title = $(this).children("a").text();
        results.link = $(this).children("a").attr("href");
        results.summary = $(this).children("p").text();

     db.Article
        .create(result)
        .then(function(dbArticle) {
          // If we were able to successfully scrape and save an Article, send a message to the client
          res.send("Scrape Complete");
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });

    });

  };


});


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article
    .find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("comment")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.comment
    .create(req.body)
    .then(function(dbcomment) {
      // If a comment was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbcomment._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


app.listen(process.env.PORT || 8080, function() {
  
  console.log("App running on port 8080!");

});

exports = module.exports = app;
