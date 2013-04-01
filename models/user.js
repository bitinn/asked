
/**
 * User model
 */

module.exports = function(db, oauth, config){

  var user = {};
  var prefix = 'user';

  // oauth setup - twitter
  oauth.passport.use(new oauth.twitter({
      consumerKey: config.twitter.consumerKey,
      consumerSecret: config.twitter.consumerSecret,
      callbackURL: config.twitter.callbackURL
    },
    twitterUser
  ));

  // oauth setup - weibo
  oauth.passport.use(new oauth.weibo({
      clientID: config.weibo.clientID,
      clientSecret: config.weibo.clientSecret,
      callbackURL: config.weibo.callbackURL
    },
    weiboUser
  ));

  // what to store/retrieve from session
  oauth.passport.serializeUser(function(user, done) {

    done(null, user.local);

  });

  oauth.passport.deserializeUser(function(local, done) {

    var user = {
      local: local
    };

    loginUser(user, function(err, resp){

      resp = JSON.parse(resp);
      done(err, resp);

    });

  });

  // expose authenticate api
  user.twitter = oauth.passport.authenticate('twitter');
  user.weibo = oauth.passport.authenticate('weibo');

  user.twitterCallback = oauth.passport.authenticate('twitter', { successRedirect: '/account', failureRedirect: '/login' });
  user.weiboCallback = oauth.passport.authenticate('weibo', { successRedirect: '/account', failureRedirect: '/login' });

  // wrapper oauth handler, normalize twitter profile
  function twitterUser(token, tokenSecret, profile, done) {

    if(!profile) {
      console.log('fire');
      return done(null, false);
    }

    var user = {
      provider: profile.provider,
      id: profile.id,
      username: profile.username,
      nickname: profile.displayName,
      avatar: profile.photos[0].value,
      token: token,
      secret: tokenSecret
    }

    oauthUser(user, done);

  }

  // wrapper oauth handler, normalize weibo profile
  function weiboUser(accessToken, refreshToken, profile, done) {

    if(!profile) {
      console.log('fire');
      return done(null, false);
    }

    var user = {
      provider: profile.provider,
      id: profile.id,
      username: profile.username,
      nickname: profile.nickname,
      avatar: profile.avatarUrl,
      token: accessToken,
      secret: refreshToken
    }

    oauthUser(user, done);

  }

  // handle oauth result
  function oauthUser(user, done) {

    // construct local profile id of this user
    user.local = prefix + '.' + user.provider + '.' + user.id;

    // find existing user and run callback
    matchUser(user, done, authAction);

  }

  // handle user matching result
  function authAction(error, result, user, done) {

    if(error) return done(error);

    // user exists
    if(result == 1) {

      loginUser(user, function(err, resp){

        if(err) return done(err);

        resp = JSON.parse(resp);
        return done(null, resp);

      });

    // user does not exist
    } else {

      registerUser(user, function(err, resp, user){

        if(err) return done(err);

        if(resp == 'OK')
          return done(null, user);
        else
          return done(null, false);

      });

    }

  }

  // exist user
  function matchUser(user, done, next) {

    db.exists(user.local, function(err, resp){

      next(err, resp, user, done);

    });

  }

  // login user
  function loginUser(user, next) {

    db.get(user.local, next);

  }

  // register user
  function registerUser(user, next) {

    db.set(user.local, JSON.stringify(user), function(err, resp){

      next(err, resp, user);

    });

  }

  // legacy testing
  user.add = function(params, next) {

    console.log(params);
    next();

  }

  return user;

};

