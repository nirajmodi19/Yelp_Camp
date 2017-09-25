const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/db_2');

var postSchema = new mongoose.Schema({
	title: String,
	content: String
});

var Post = mongoose.model('Post', postSchema);

var userSchema = new mongoose.Schema ({
	email: String,
	name: String,
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	}]
});

var User = mongoose.model('User',userSchema);

// Post.create({
// 	title: "asdasd asda asd 2",
// 	content: "asd asd asd asd asd asd"
// }, (err, post) => {
// 	User.findOne({email: 'niraj@gmail.com'}, (err, foundUser) => {
// 		if(err) {
// 			console.log(err);
// 		}else {
// 			foundUser.posts.push(post);
// 			foundUser.save((err, data) => {
// 				if(err) {
// 					console.log(err);
// 				} else {
// 					console.log(data);
// 				}
// 			});
// 		}
// 	});
// });

//populate

// User.findOne({email: 'niraj@gmail.com'}).populate("posts").exec((err, user) => {
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		console.log(user);
// 	}
// });