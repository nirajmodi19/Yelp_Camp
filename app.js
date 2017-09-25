const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp');

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
// 	name: 'aaa',
// 	image: "http://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
// 	description: "Hey I am learning node js"
// }, (err, data) => {
// 	if (err) {
// 		console.log('Something went wrong');
// 		console.log(err);
// 	} else {
// 		console.log(data);
// 	}
// })

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
	Campground.findById(req.params.id, (err, data) => {
		if (err) {

		}else {
			res.render('show', {data});
		}
	});
});

app.listen(process.env.PORT||3000, () => {
	console.log('Server Started');
})