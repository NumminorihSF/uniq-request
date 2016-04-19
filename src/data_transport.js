/**
 * Created by numminorihsf on 09.03.16.
 */
"use strict";
function DataTransport(options){
  this.paths = (options || {});
  this.paths.source = (this.paths.source || 'res.locals').split('.');
  this.paths.dest = (this.paths.dest || 'res.locals').split('.');
  this.destLastKey = this.paths.dest.pop();
}

DataTransport.prototype._searchDataInPath = function(path, sources){
  return path.reduce(function(result, key){
    return result[key];
  }, sources);
};

DataTransport.prototype.get = function(sources, callback){
  var data;
  try{
    data = this._searchDataInPath(this.paths.source, sources);
  }
  catch(e){
    return callback(new Error('Not such key-path in object (' + path.join('.') + ')'));
  }
  return callback(null, data);
};

DataTransport.prototype.put = function(destinations, data){
  var destObject = this.paths.dest.reduce(function(result, key){
    if (!(key in result)) result[key] = {};
    return result[key];
  }, destinations);
  destObject[this.destLastKey] = data;
  return destinations;
};

module.exports = DataTransport;