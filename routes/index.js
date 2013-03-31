
/*
 * GET available routes (controller)
 */

module.exports = function(models){

  var routes = {};

  routes.home = require('./home.js')(models);
  routes.user = require('./user.js')(models);

  return routes;

};
