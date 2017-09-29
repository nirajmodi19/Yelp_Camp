var express = require('express');
var router = express.Router();
var Campground = require('./../models/campground');
var Comment = require('./../models/comment');
var middleware = require('./../middleware');

router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn,  (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', {campground});
		}
	});	
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
			res.redirect('/campgrounds');
		}else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){ 
					req.flash('error', 'Something went wrong');
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Successfully added a comment');
					res.redirect(`/campgrounds/${campground._id}`);
				}	
			});
		}
	});
});

//Comment Edit
router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//Comment Update
router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('Successfully edited comment');
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

//Comment Destroy
router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err) {
			req.flash('error', 'Comment cannot be deleted');
			res.redirect('back');
		} else {
			req.flash('success', 'Comments Deleted!')
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	})
});

module.exports = router;