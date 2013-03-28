
/**
 * Module dependencies.
 */

// express or core modules

var express = require('express')
  , routes = require('./routes')
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
  , han = require('han');

// kick-off the basis

var app = express()
  , server = http.createServer(app)
  , io = socket.listen(server)
  , db = redis.createClient()
  , check = validator.check
  , sanitize = validator.sanitize
  , search = reds.createSearch('similar');

// i18n translation

var i18n = new (require('i18n-2'))({
  locales: ['en', 'zh', 'ja'],
  defaultLocale: 'en',
  cookie: 'client_locale',
  directory: __dirname + '/locales',
  updateFiles: true,
  extension: '.json'
});

// swig engine init

swig.init({
    root: __dirname + '/views', //match views setting in express
    allowErrors: true //swig will not suppress error, leave it to express
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
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// development and production configuration

app.configure('development', function(){
  app.use(express.errorHandler());
});

// server-side routing

app.get('/', routes.home.index);
app.get('/users', routes.users.list);

// start server

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
