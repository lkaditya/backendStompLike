const jwt = require("jsonwebtoken");
const User = require("../model/user")

//middleware to process with the authorization for all the functionality after login
const auth = async (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    console.log("Token: ", token);
    try {
        let data = jwt.verify(token, process.env.JWT_KEY);
        console.log("verified: ", data);
        req.user_id = data._id;
        req.token = token;
        let user = await User.findOne({ _id: data._id });
        if (!user) {
            console.log("it goes wrong here");
            throw new Error();
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(JSON.stringify(error));
        console.log(error.stack);
        res.status(401).send({
            error: "Not authorized to access this resource"
        });
    }
};
module.exports = auth;
