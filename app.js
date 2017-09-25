const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {Campground} = require('./models/campground.js');
const {seedDB} = require('./seed.js');

mongoose.connect('mongodb://localhost/yelp_camp');

seedDB();

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/campgrounds', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if(err) {
			console.log(err);
		} else {	
			res.render('index', {campgrounds})
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
	res.render('new.ejs');
});

app.get('/campgrounds/:id', (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, data) => {
		if (err) {
			console.log(err);
		} else {
			res.render('show', {data});
		}
	});
});

app.listen(process.env.PORT||3000, () => {
	console.log('Server Started');
})