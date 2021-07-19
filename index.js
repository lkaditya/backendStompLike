const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const userRouter= require("./router/user.router")
const newsRouter = require("./router/news.router")

const app = express();
const PORT = process.env.PORT

//for processing post method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//logging
app.use(morgan('combined'));
//allow cors
app.use(cors());
//allow both routers to be used
app.use(newsRouter);
app.use(userRouter);

//connect to DB
let DATABASE_URL = process.env.DATABASE_URL; 
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
    app.listen(PORT, () => {
        console.log("app is running on port ", PORT);
    });
});

