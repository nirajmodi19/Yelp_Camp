var express = require('express');
var router = express.Router();
var Campground = require('./../models/campground');
var middleware = require('./../middleware');

router.get('/campgrounds', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if(err) {
			console.log(err);
		} else {	
			res.render('campgrounds/index', {campgrounds});
		}
	});
});

router.post('/campgrounds', middleware.isLoggedIn, (req, res) => {
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

router.get('/campgrounds/new', middleware.isLoggedIn, (req, res) => {
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

//EDIT CAMPGROUND
router.get('/campgrounds/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		res.render('campgrounds/edit', {campground});
	});
});

//UPDATE CAMPGROUND
router.put('/campgrounds/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	})
});

//DELETE CAMPGROUND
router.delete('/campgrounds/:id', middleware.checkCampgroundOwnership, (req,res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			 res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;