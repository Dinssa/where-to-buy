const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Home',
    errorMessages: [] 
  });
});

// Get login page
router.get('/login', alreadyLoggedIn, function(req, res, next) {
  let message = null;
  if (req.query.r) {
    switch (req.query.r) {
      case '1': message = 'You must be logged in to view that page'; break;
      case '2': message = 'Please login or signup to contribute. Thank you!'; break;
    }
  }
  res.render('login', { title: 'Login', message });
});

function alreadyLoggedIn(req, res, next) {
  if (req.user) {
    res.redirect('/');
  } else {
    next();
  }
}

// Post login page
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
  'google',
  {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/',
    failureRedirect: '/'
  }
));

// OAuth logout route
router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/');
  });
});

module.exports = router;
