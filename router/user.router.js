const express = require('express');
const router = express.Router();
const User = require("../model/user");

//process the login post request
router.post("/api/login", async (req, res) => {
    try {
        console.log(req.body);
        let { username, password } = req.body;
        //login process to database
        let user = await User.findByCredentials(username, password);
        console.log(user);
        if (!user) {
            return res.status(401).contentType("application/json").json({ error: "Login Failed" });
        }
        const token = await user.generateAuthToken();
        console.log("token= " + token);
        res.send({ username, token });
    } catch (e) {
        console.log(e);
        return res.status(500).contentType("application/json").json({ error: "application error" });
    }
});

module.exports = router;