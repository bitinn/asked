
/**
 * User model
 */

module.exports = function(db, oauth, config){

  var user = {};

  // oauth setup - twitter
  oauth.passport.use(new oauth.twitter({
      consumerKey: config.twitter.consumerKey,
      consumerSecret: config.twitter.consumerSecret,
      callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {

      //var params = {};
      //console.log(profile);
      return done(null, profile);

      /*
      User.findOne(params, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
      */

    }
  ));

  // what to store/retrieve from session
  oauth.passport.serializeUser(function(user, done) {
    done(null, user);
  });

  oauth.passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // expose authenticate api
  user.twitter = oauth.passport.authenticate('twitter');

  user.twitterCallback = oauth.passport.authenticate('twitter', { successRedirect: '/account', failureRedirect: '/login' });

  user.add = function(params, next) {

    console.log(params);
    next();

  }

  return user;

};

