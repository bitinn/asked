
/**
 * Module dependencies.
 */

// express and core modules

var express = require('express')
  , http = require('http')
  , path = require('path');

// function specific modules 

var redis = require('redis')
  , socket = require('socket.io')
  , cons = require('consolidate')
  , swig = require('swig')
  , validator = require('validator')
  , reds = require('reds')
  , passport = require('passport')
  , i18n = require('i18n')
  , han = require('han');

// kick-off the basis

var app = express()
  , server = http.createServer(app)
  , io = socket.listen(server)
  , db = redis.createClient()
  , check = validator.check
  , sanitize = validator.sanitize
  , search = reds.createSearch('similar');

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

  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');

  app.engine('jade', cons.jade);
  app.engine('html', cons.swig);
  app.set('view engine', 'html');
  
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser())
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

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

});

// development and production specific configuration

app.configure('development', function(){
  app.use(express.errorHandler());
});

// server-side model

var models = require('./models')(db);

// server-side routing

var routes = require('./routes')(models);

app.get('/', routes.online.index);
app.get('/en', function(req, res){
  i18n.setLocale(req, 'en');
  routes.online.index(req, res);
});
app.get('/zh', function(req, res){
  i18n.setLocale(req, 'zh');
  routes.online.index(req, res);
});
app.get('/online', routes.online.add);

// start server

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
