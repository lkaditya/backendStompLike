const mongoose = require("mongoose");
const app = require("../index.js");

let DATABASE_URL = process.env.DATABASE_URL || "mongodb + srv://user001:mongodbPASSWORD@cluster0assignment.3j5me.mongodb.net/news"
    //"mongodb://localhost:27017/news";

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => {
    console.error.bind(console, "connection error:");
});
db.once("open", function () {
    console.log(mongoose.STATES[mongoose.connection.readyState]);
    console.log("Connected to database.");
    app.emit('ready');
});