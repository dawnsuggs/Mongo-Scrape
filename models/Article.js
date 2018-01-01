// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

    title:{
      type: String,
      required: true,
      unique: true
    },
    link: {
      type: String,
      required: true,
      unique: true
    },
    summary: {
      type: String,
      required: true,
      unique: true
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;