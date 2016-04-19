"use strict";

var EE = require('events').EventEmitter;
var defaultChecker = require('./default_checker');

function Uniq (uniqChecker){
  this.checker = typeof uniqChecker === 'function' ? uniqChecker :
    typeof options === 'function' ? options : defaultChecker;
  this.asyncCheck = this.checker.length > 2;
  this.memory = Object.create(null);
}

Uniq.prototype.doIfUnique = function(uniqString, callbackIfUniq){
  if (!(uniqString in this.memory)){
    let ee = new EE();
    this.memory[uniqString] = {
      ee: ee
    };
    ee.setMaxListeners(0);
    ee.once('result', () => {
      setImmediate(() => {
        delete this.memory[uniqString];
      });
    });
    return process.nextTick(callbackIfUniq);
  }
};

Uniq.prototype.getString = function(req, res, callback){
  if (this.asyncCheck){
    return this.checker(req, res, callback);
  }
  return callback(null, this.checker(req, res));
};

Uniq.prototype.onReady = function(uniqString, callback){
  if ('result' in this.memory[uniqString]){ //TODO check that can be
    return callback(this.memory[uniqString].error, this.memory[uniqString].result);
  }
  this.memory[uniqString].ee.once('result', (error, result) => {
    if (error){
      this.memory[uniqString].error = error;
    }
    this.memory[uniqString].result = result;
    return callback(error, result);
  });
};

Uniq.prototype.yell = function(uniqString, err, res){
  return this.memory[uniqString].ee.emit('result', err, res);
};

module.exports = Uniq;