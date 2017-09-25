const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/db');

var postSchema = new mongoose.Schema({
	title: String,
	content: String
});

var Post = mongoose.model('Post', postSchema);

var userSchema = new mongoose.Schema ({
	email: String,
	name: String,
	posts: [postSchema]
});

var User = mongoose.model('User',userSchema);

// var user = new User({
// 	email: 'niraj@test.com',
// 	name: 'niraj'
// });

// user.posts.push({
// 	title: "asdas asdasd asdasd",
// 	content: "asdasd asdasd asdasd asdas asd asasd"
// });

// user.save((err, data) => {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log(data);
// 	}
// });

// var post = new Post({
// 	title: 'Hello World',
// 	content: 'I am loving it'
// });

// post.save((err, data) => {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log(data);
// 	}
// });

User.findOne({name: "niraj"}, (err, user) => {
	if (err) {
		console.log(err);
	} else {
		user.posts.push({
			title: 'Newly created post',
			content: 'Successfully created new post'
		});
		user.save((err, user) => {
			if(err) {
				console.log(err);
			}else{
				console.log(user);
			}
		});
	}
});