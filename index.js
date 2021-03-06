const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const User = require("./model/user");
const News = require("./model/news");

require("dotenv").config();

const multer = require('multer')
    , inMemoryStorage = multer.memoryStorage()
    , uploadStrategy = multer({ storage: inMemoryStorage }).single('image')

    , azureStorage = require('azure-storage')
    , blobService = azureStorage.createBlobService()

    , getStream = require('into-stream')
    , containerName = 'thumbnails'
    ;



const app = express();
const PORT = process.env.PORT || 3000
const auth = require("./middleware/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cors());


app.get('/api/viewNews', async (req, res) => {

    let newscontent = await News.find().sort({ datetime: 'descending' });

    res.status(200).contentType("application/json").send(newscontent);
});

app.post("/api/postNews", uploadStrategy,auth, async (req, res) => {
    //need to put the auth later

    console.log('it is received here');
    const blobName = getBlobName(req.file.originalname) + ".jpg";
    const stream = getStream(req.file.buffer);
    const streamLength = req.file.buffer.length;

    await blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {

        if (err) {
            handleError(err);
            return;
        }
    });

    const title = req.body.title;
    const comments = req.body.comment;
    const url = "https://assignmentimagestorage.blob.core.windows.net/thumbnails/" + blobName;
    const unit = new News({
        imageurl: url,
        title: title,
        comments: comments,
        datetime: new Date()
    });
    //console.log(unit);
    await unit.save();

    

});

app.post("/api/login", async (req, res) => {
    try {
        console.log(req.body);
        let { username, password } = req.body;
        //login process to database
        let user =await User.findByCredentials(username, password);
        console.log(user);
        if (!user) {
            return res.status(401).contentType("application/json").json({ error: "Login Failed" });
        }
        const token = await user.generateAuthToken();
        console.log("token= "+token);
        res.send({ username, token });
    } catch (e) {
        console.log(e);
        return res.status(500).contentType("application/json").json({ error: "application error" });
    }
})

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};


//require("./model/db.js");
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

