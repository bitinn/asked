
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: res.__("Site Name") });
};

exports.lang = function(req, res){
  res.render('index', { title: res.__("Site Name") });
};

