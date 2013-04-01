
/*
 * GET user authentication.
 */

module.exports = function(models){

  var user = {};

  user.twitter = models.user.twitter;

  user.twitterCallback = models.user.twitterCallback;

  user.weibo = models.user.weibo;

  user.weiboCallback = models.user.weiboCallback;

  return user;

};
