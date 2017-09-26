const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const {Campground} = require('./models/campground.js');
const {seedDB} = require('./seed.js');
const {Comment} = require('./models/comment');
const User = require('./models/User');

mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true});

seedDB();

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

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/campgrounds', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if(err) {
			console.log(err);
		} else {	
			res.render('campgrounds/index', {campgrounds});
		}
	});
	// res.render('campgrounds',{campgrounds});
});

app.post('/campgrounds', (req, res) => {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name, image, description};
	Campground.create(newCampground, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds'); 
		}
	});
	

});

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

app.get('/campgrounds/:id', (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, data) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/show', {data});
		}
	});
});

//@@@@@@@@@@@@@@@@@@@@@@@@
//COMMENTS ROUTES
//@@@@@@@@@@@@@@@@@@@@@@@@

app.get('/campgrounds/:id/comments/new',isLoggedIn,  (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', {campground});
		}
	});	
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
			res.redirect('/campgrounds');
		}else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){ 
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect(`/campgrounds/${campground._id}`);
				}	
			});
		}
	});
});

//@@@@@@@@@@@@@@@@@@@@@@@@
//AUTHENTICATION ROUTES
//@@@@@@@@@@@@@@@@@@@@@@@@

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			console.log(err);
			return res.render('register');
		}
		passport.authenticate("local")(req, res, () => {
			res.redirect('/campgrounds');
		});	
	});
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', passport.authenticate("local", {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}), (req, res) => {

});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

app.listen(process.env.PORT||3000, () => {
	console.log('Server Started');
});