const mongoose = require("mongoose");
//const jwt = require("jsonwebtoken");
//const validator = require("validator");

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
    }
});

const News = mongoose.model("News", schema, "newsdata");

module.exports = News;