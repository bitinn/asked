
/*
 * GET home page and stats.
 */

module.exports = function(models){

  var home = {};

  home.index = function(req, res){
    res.render('index', { title: res.__("Site Name") });
  };

  home.login = function(req, res){
    res.send('<html><body><p><a href="/auth/twitter">Sign in with Twitter</a></p><p><a href="/auth/weibo">Sign in with Weibo</a></p></body></html>');
  };

  home.logout = function(req, res){
    req.logout();
    res.redirect('/');
  };

  home.message = function(req, res){
    res.send('Hello ' + req.user.username + ', we have made an improvement to our system: you can now skip the question/answer altogether, oh boy what a relief!');
  };

  return home;

};
