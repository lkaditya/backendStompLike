const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const News = require("../model/news");

require("dotenv").config();

//setup the library to received the uploaded image and store to blob azure
const multer = require('multer')
    , inMemoryStorage = multer.memoryStorage()
    , uploadStrategy = multer({ storage: inMemoryStorage }).single('image')

    , azureStorage = require('azure-storage')
    , blobService = azureStorage.createBlobService()

    , getStream = require('into-stream')
    , containerName = 'thumbnails'
    ;

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};

//route to get the news from the database and sort it by date
router.get('/api/viewNews', async (req, res) => {

    let newscontent = await News.find().sort({ datetime: 'descending' });

    res.status(200).contentType("application/json").send(newscontent);
});

//route to process post request of a news income (containing text and image)
router.post("/api/postNews", uploadStrategy, auth, async (req, res) => {

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
        datetime: new Date(),
        poster: req.body.poster
    });
    //console.log(unit);
    await unit.save();



});



module.exports = router;