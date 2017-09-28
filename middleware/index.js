const Campground = require('./../models/campground.js');
const Comment = require('./../models/comment.js');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			res.redirect('back');
		} else {
			if(campground.author.id.equals(req.user._id)) {
				next();
			} else {
				res.redirect('back');
			}	
		}
	});
	} else {
		res.redirect('back');
	}
}


middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, comment) => {
		if (err) {
			res.redirect('back');
		} else {
			if(comment.author.id.equals(req.user._id)) {
				next();
			} else {
				res.redirect('back');
			}	
		}
	});
	} else {
		res.redirect('back');
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}



module.exports = middlewareObj;