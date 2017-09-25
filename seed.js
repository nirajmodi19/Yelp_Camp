var mongoose = require('mongoose');
var {Campground} = require('./models/campground.js');
var {Comment} = require('./models/comment.js');

var data = [
	{
		name: 'Aaa asdasd',
	 	image: 'https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg',
	  	description: 'blah blah blah'
	},
	{
		name: 'Bbb asdasd',
	 	image: 'https://farm1.staticflickr.com/93/246477439_5ea3e472a0.jpg',
	  	description: 'blah blah blah'
	},
	{
		name: 'Ccc asdasd',
	 	image: 'https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg',
	  	description: 'blah blah blah'
	}
];

function seedDB() {
	Campground.remove({}, (err) => {
		if(err) {
			console.log(err);
		} else {
			console.log('Campground removed');
			data.forEach((seed) => {
			Campground.create(seed, (err, campground) => {
				if (err) {
					console.log(err);
				} else {
					console.log('added a campground');
					Comment.create(
					{
						text: 'This is comment',
						author: 'author'
					}, (err, comment) => {
						campground.comments.push(comment);
						campground.save();
						console.log('Created new comment!');
					});
				}
			});
		});
	}
	});
}

module.exports = {seedDB};