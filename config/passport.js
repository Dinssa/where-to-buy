const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET_KEY,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                return cb(null, user);
            } else {
                user = await User.create({
                    name: profile.displayName,
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value
                });
                return cb(null, user);
            }
        } catch (err) {
            return cb(err);
        }
    }
));

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async function(email, password, cb) {
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return cb(null, false);
      }
      if (!user.validPassword(password)) {
        return cb(null, false);
      }
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

passport.serializeUser(function(user, cb) {
    cb(null, user._id);  
});
  
passport.deserializeUser(async function(userId, cb) {
    cb(null, await User.findById(userId));
});