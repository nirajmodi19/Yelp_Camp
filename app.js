const express = require('express');
const bodyParser = require('body-parser');

var campgrounds = [
	{name: 'aaa', image: "http://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
	{name: 'bbb', image: "https://farm4.staticflickr.com/3823/9229572323_03aabc6e59.jpg"},
	{name: 'ccc', image: "https://farm1.staticflickr.com/63/227641826_f7c50e1f43.jpg"},
	{name: 'aaa', image: "http://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
	{name: 'bbb', image: "https://farm4.staticflickr.com/3823/9229572323_03aabc6e59.jpg"},
	{name: 'ccc', image: "https://farm1.staticflickr.com/63/227641826_f7c50e1f43.jpg"},
	{name: 'aaa', image: "http://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
	{name: 'bbb', image: "https://farm4.staticflickr.com/3823/9229572323_03aabc6e59.jpg"},
	{name: 'ccc', image: "https://farm1.staticflickr.com/63/227641826_f7c50e1f43.jpg"}
	];

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/campgrounds', (req, res) => {
	
	res.render('campgrounds',{campgrounds});
});

app.post('/campgrounds', (req, res) => {
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	res.redirect('/campgrounds'); 

});

app.get('/campgrounds/new', (req, res) => {
	res.render('new.ejs');
});

app.listen(process.env.PORT||3000, () => {
	console.log('Server Started');
})