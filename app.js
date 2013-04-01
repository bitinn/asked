
/**
 * Module dependencies.
 */

// express and core modules

var express = require('express')
  , http = require('http');
  //, path = require('path');

// function specific modules 

var redis = require('redis')
  , cons = require('consolidate')
  , swig = require('swig')
  , validator = require('validator')
  , i18n = require('i18n')
  , ensure = require('connect-ensure-login');
  //, socket = require('socket.io')
  //, reds = require('reds')
  //, han = require('han');

// oauth modules

var oauth = {};
oauth.passport = passport = require('passport');
oauth.twitter = require('passport-twitter').Strategy;
oauth.weibo = require('passport-weibo').Strategy;

// kick-off the basis

var app = express()
  , server = http.createServer(app)
  , db = redis.createClient()
  , check = validator.check
  , sanitize = validator.sanitize
  , guard = ensure.ensureLoggedIn;
  //, io = socket.listen(server)
  //, search = reds.createSearch('similar');

// config file

var config = require('./config.js');

// redis error output 

db.on('error', function (err) {
  console.log("Error " + err);
});

// swig engine init

swig.init({
  root: __dirname + '/views', //= express views
  allowErrors: true //= leave error handling to express
});

// i18n translation setup

i18n.configure({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  cookie: 'client_locale',
  directory: __dirname + '/locales',
  extension: '.js',
  updateFiles: true,
});

// site-wide configuration

app.configure(function(){

  app.set('port', config.site.port || 3000);
  app.set('views', __dirname + '/views');

  app.engine('jade', cons.jade);
  app.engine('html', cons.swig);
  app.set('view engine', 'html');
  
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser( config.cookie.signKey ))
  app.use(express.session({ secret: config.cookie.sessionKey }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());

  // guess client language
  app.use(i18n.init);

  // i18n should come before router, otherwise __ won't be available
  app.use(function(req, res, next) {
    res.locals.__ = res.__ = function() {
      return i18n.__.apply(req, arguments);
    };
    res.locals.__n = res.__n = function() {
      return i18n.__n.apply(req, arguments);
    };
    // important for control flow, will hang if missing
    next();
  });

  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  
  app.use(function(err, req, res, next){
    res.send('500 - This server is sorry about that :(', 500);
  });

});

// development and production specific configuration

app.configure('development', function(){
  app.use(express.errorHandler());
});

// server-side model

var models = require('./models')(db, oauth, config);

// server-side routing

var routes = require('./routes')(models);

app.get('/', routes.home.index);

app.get('/en', function(req, res){
  i18n.setLocale(req, 'en');
  routes.home.index(req, res);
});

app.get('/zh', function(req, res){
  i18n.setLocale(req, 'zh');
  routes.home.index(req, res);
});

// twitter oauth init
app.get('/auth/twitter', oauth.passport.authenticate('twitter'));

// twitter oauth callback
app.get('/auth/twitter/callback', oauth.passport.authenticate('twitter', { successRedirect: '/account', failureRedirect: '/login' }));

// twitter oauth init
app.get('/auth/weibo', oauth.passport.authenticate('weibo'));

// twitter oauth callback
app.get('/auth/weibo/callback', oauth.passport.authenticate('weibo', { successRedirect: '/account', failureRedirect: '/login' }));

// user profile display
app.get('/account', guard('/login'), routes.home.message);

// user login
app.get('/login', routes.home.login);

// user logout
app.get('/logout', routes.home.logout);

// catch-all
app.get('*', function(req, res){
  res.send('404 - This resource is missing, so sad :(', 404);
});

// start server

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
