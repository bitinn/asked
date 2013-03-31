
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

  return user;

};
