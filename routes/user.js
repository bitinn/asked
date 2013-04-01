
/*
 * GET user authentication.
 */

module.exports = function(models){

  var user = {};

  user.twitter = function(req, res) {

    models.user.twitter(req, res);

  }

  user.twitterCallback = function(req, res) {

    models.user.twitterCallback(req, res);

  }

  user.weibo = function(req, res) {

    models.user.weibo(req, res);

  }

  user.weiboCallback = function(req, res) {

    models.user.weiboCallback(req, res);

  }

  return user;

};
