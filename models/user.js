
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
    done(null, user);
  });

  oauth.passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // expose authenticate api
  user.twitter = oauth.passport.authenticate('twitter');
  user.weibo = oauth.passport.authenticate('weibo');

  user.twitterCallback = oauth.passport.authenticate('twitter', { successRedirect: '/account', failureRedirect: '/login' });
  user.weiboCallback = oauth.passport.authenticate('weibo', { successRedirect: '/account', failureRedirect: '/login' });

  // wrapper oauth handler
  function twitterUser(token, tokenSecret, profile, done) {

    if(!profile) {
      return done(err);
    }

    var user = {
      provider: profile.provider,
      id: profile.id,
      username: profile.username,
      nickname: profile.displayName,
      avatar: profile.photos[0].value
    }

    oauthUser(token, tokenSecret, user, done);

  }

  function weiboUser(token, tokenSecret, profile, done) {

    if(!profile) {
      return done(err);
    }

    var user = {
      provider: profile.provider,
      id: profile.id,
      username: profile.username,
      nickname: profile.nickname,
      avatar: profile.avatarUrl
    }

    oauthUser(token, tokenSecret, user, done);

  }

  // handle oauth result
  function oauthUser(token, tokenSecret, profile, done) {

    var params = profile;

    // the local profile id of this user
    params.local = prefix + '.' + params.provider + '.' + params.id;

    matchUser(params, function(err, resp){

      if(resp == 1) {

        loginUser(params, function(err, resp){
          var user = JSON.parse(resp);
          return done(null, user);
        });

      } else {

        registerUser(params, function(err, resp){
          if(resp == 'OK')
            return done(null, params);
        });

      }

    });

  }

  // exist user
  function matchUser(params, next) {

    db.exists(params.local, next);

  }

  // login user
  function loginUser(params, next) {

    db.get(params.local, next);

  }

  // register user
  function registerUser(params, next) {

    db.set(params.local, JSON.stringify(params), next);

  }

  // expose local function
  user.matchUser = matchUser;
  user.loginUser = loginUser;
  user.registerUser = registerUser;

  // legacy testing
  user.add = function(params, next) {

    console.log(params);
    next();

  }

  return user;

};

