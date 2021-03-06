const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const userRouter= require("./router/user.router")
const newsRouter = require("./router/news.router")





const app = express();
const PORT = process.env.PORT


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cors());
app.use(newsRouter);
app.use(userRouter);


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

