/**
 * Created by numminorihsf on 09.03.16.
 */
"use strict";
var Uniq = require('./uniq');
var DataTransport = require('./data_transport');

function prepareAggregator(uniqChecker, dataTransport){
  return function(_funcArray) {
    var funcArray = [];
    if (Array.isArray(_funcArray)) {
      funcArray = _funcArray.map(function (func) {
        if (typeof func === 'function') {
          return func;
        }
        throw new Error('Expected function, but has ' + typeof func);
      });
    }
    else {
      for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'function') {
          funcArray.push(arguments[i]);
        }
        else {
          throw new Error('Expected function, but has ' + typeof arguments[i]);
        }
      }
    }
    return createAggregator(uniqChecker, dataTransport, funcArray);
  }
}


function createAggregator(uniqChecker, dataTransport, funcArray){
  return function(req, res, next){
    uniqChecker.getString(req, res, function(err, str){
      if (err){
        return next(err);
      }
      var sourceAndDestObjects = {req: req, res: res, request: req, response: res};
      uniqChecker.doIfUnique(str, function(){
        asyncDo(req, res, funcArray, function(err){
          if (err) return uniqChecker.yell(str, err);
          dataTransport.get(sourceAndDestObjects, function(err, result){
            return setImmediate(function(){
              uniqChecker.yell(str, err, result);
            });
          });
        });
      });
      uniqChecker.onReady(str, function(err, result){
        if (err){
          return next(err);
        }
        dataTransport.put(sourceAndDestObjects, result);
        next();
      })
    });
  }
}

function asyncCallback(req, res, funcArray, next, i){
  return function(err){
    process.nextTick(function(){
      if (err) return next(err);
      return asyncDo(req, res, funcArray, next, i + 1);
    });
  }
}

function asyncDo(req, res, funcArray, next, i=0){
  if (i >= funcArray.length) return next();
  try{
    funcArray[i](req, res, asyncCallback(req, res, funcArray, next, i))
  }
  catch(e){
    return next(e);
  }
}


module.exports = function(options, uniqChecker){
  if (typeof options === 'function'){
    uniqChecker = options;
    options = {};
  }
  var u = new Uniq(uniqChecker);
  var dT = new DataTransport(options);
  return prepareAggregator(u, dT);
};