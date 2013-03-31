
/*
 * GET users authentication.
 */

module.exports = function(models){

  var users = {};

  users.twitter = function(req, res){

    var passport = require('passport')
      , TwitterStrategy = require('passport-twitter').Strategy;

    passport.use(new TwitterStrategy({
        consumerKey: '',
        consumerSecret: '',
        callbackURL: ''
      },
      function(token, tokenSecret, profile, done) {
        /*
        User.findOrCreate(..., function(err, user) {
          if (err) { return done(err); }
          done(null, user);
        });
        */
      }
    ));

  };

  return users;

};
