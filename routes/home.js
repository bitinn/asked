
/*
 * GET home page and stats.
 */

module.exports = function(models){

  var home = {};

  home.index = function(req, res){
    res.render('index', { title: res.__("Site Name") });
  };

  home.add = function(req, res){
    var params = {};
    params.ua = req.headers['user-agent'];
    params.date = Date.now();
    models.user.add(params, function(){
      res.render('index', { title: res.__("Site Name") });
    });
  };

  return home;

};
