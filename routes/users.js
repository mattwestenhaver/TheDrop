// /routes/users.js
const
	express = require('express'),
	passport = require('passport'),
	userRouter = express.Router()
	User = require('../models/User'),

userRouter.route('/login')
	.get((req,res) => {
    res.render('login', {message: req.flash('loginMessage')})
	})
	.post(passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login'
	}));

userRouter.route('/signup')
.get((req,res) => {
		// render create account form
		res.render('signup', {message: req.flash('signupMessage')})
	})
	.post(passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup'
	}));

userRouter.get('/profile/', isLoggedIn , (req,res) => {
			console.log("in profile")
		  res.render('profile', {user: req.user})
});

userRouter.get('/profile/:id', (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) console.log(err)
		console.log(user)
		res.render('users', {user: user})
	})
})

userRouter.get('/logout', (req,res) => {
  req.logout()
	res.redirect('/')
});

userRouter.patch('/profile', (req, res) =>{
	console.log(req.body);
	User.findByIdAndUpdate(req.body.data, {bio:req.body.mytext}, {new:true}, (err, updatedBio) =>{
		if(err) return console.log(err)
		res.render('/profile')
	})
})

// a method used to authorize a user BEFORE allowing them to proceed to the profile page:
function isLoggedIn(req, res, next){
	console.log("its authenticated" + req.isAuthenticated())
	if(req.isAuthenticated()) return next()
	res.redirect('/login')
}


userRouter.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}))

userRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/profile',
	failureRedirect: '/'
}))


module.exports = userRouter
