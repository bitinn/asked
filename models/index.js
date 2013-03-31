
/**
 * Database models collection
 */

module.exports = function(db, oauth, config){

  var models = {};

  //user authentication
  models.user = require('./user.js')(db, oauth, config);

  return models;

};
