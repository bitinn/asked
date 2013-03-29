
/**
 * Database module (model) - we may separate it into smaller model later
 */

module.exports = function(db){

  var online = {};

  //add ua to online collection - no repeat
  online.add = function(params, next) {
    db.zadd('online', Date.now(), params.ua, next);
  }

  return online;

};

