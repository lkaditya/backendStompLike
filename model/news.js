const mongoose = require("mongoose");

//define the schema model for news object
const schema = new mongoose.Schema({
    imageurl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    comments: {
        type: String, required: true
    },
    datetime: {
        type: Date,required:true
    },
    poster: {
        type: String
    }
});

//export the news object to be used in the main
const News = mongoose.model("News", schema, "newsdata");

module.exports = News;