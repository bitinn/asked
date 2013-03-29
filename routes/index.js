
/*
 * GET available routes (controller)
 */

module.exports = function(models){

  var routes = {};

  routes.online = require('./home.js')(models);
  routes.users = require('./user.js');

  return routes;

};
