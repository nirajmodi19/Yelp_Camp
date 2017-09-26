//Global Modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

//Local modules
const Campground = require('./models/campground.js');
const seedDB = require('./seed.js');
const Comment = require('./models/comment');
const User = require('./models/user');

//Requiring Routes
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');

//Connecting through database using mongoose
mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true});

//Seed DataBase for testing 
//seedDB();

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
	secret: "I am loving node",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

//Using routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT||3000, () => {
	console.log('Server Started');
});