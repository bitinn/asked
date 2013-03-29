
/**
 * Database models collection
 */

module.exports = function(db){

  var models = {};

  //count who's online
  models.online = require('./db.js')(db);

  return models;

};
