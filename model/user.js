const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const getJwtBody = ({ _id, username,roles }) => ({ _id, username,roles });

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: "Invalid email address" });
            }
        },
    },
    password: { type: String, required: true, minlength: 5 },
    roles: { type: [{ type: String }], default: ["user"] }
});

//non-default method
schema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign(getJwtBody(user), process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXP,
    });
    return token;
}

//non-default method
schema.statics.findByCredentials = async (username, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ username });
    if (!user) {

        throw new Error("Invalid login credentials");
    }
    //const isMatched = await bcrypt.compare(password, user.password);
    const isMatched = password === user.password;
    if (!isMatched) {
        throw new Error("Invalid login credentials");
    }
    return user;
};

const User = mongoose.model("User", schema, "user");
module.exports = User;