const mongoose = require('mongoose');
const passortLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String
});

userSchema.plugin(passortLocalMongoose);

module.exports = mongoose.model("User", userSchema);