var express = require('express');
var router = express.Router();
var Campground = require('./../models/campground');

router.get('/campgrounds', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if(err) {
			console.log(err);
		} else {	
			res.render('campgrounds/index', {campgrounds});
		}
	});
});

router.post('/campgrounds', isLoggedIn, (req, res) => {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username 
	}
	var newCampground = {name, image, description, author};
	Campground.create(newCampground, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds'); 
		}
	});
});

router.get('/campgrounds/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

router.get('/campgrounds/:id', (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, data) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/show', {data});
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;