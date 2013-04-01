
/**
 * Module configuration - update and rename to config.js for actual use
 */

var config = {}

config.site = {};
config.twitter = {};
config.weibo = {};
config.cookie = {};

config.site.port = 3000;

config.twitter.consumerKey = '';
config.twitter.consumerSecret = '';
config.twitter.callbackURL = '';

config.weibo.clientID = '';
config.weibo.clientSecret = '';
config.weibo.callbackURL = '';

//lazy generator - https://api.wordpress.org/secret-key/1.1/
config.cookie.signKey = '';
config.cookie.sessionKey = '';

module.exports = config;