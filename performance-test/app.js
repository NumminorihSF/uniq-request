/**
 * Created by numminorihsf on 09.03.16.
 */
"use strict";
var express = require('express');
var app = express();
var wrapper = require('../build')();

var setLocals = function(req, res, next){
  res.locals.response = 'Hello World!';
  return next();
};

var wait = function(req, res, next){
  setTimeout(next, 2000);
};

var calc = function(req, res, next){
  var str = '';
  for(var i = 0; i < 20000; i++){
    str += i;
  }
  res.locals.response = str;
  return next();
};

var sendResponse = function (req, res) {
  res.send(res.locals.response);
};

var Middles = {
  plain: [],
  wait: [wait],
  calc: [calc],
  hiload: [wait, calc, calc, wait, calc, calc, wait, calc, calc, wait]
};

[
  'plain',
  'wait',
  'calc',
  'calc/wait',
  'wait/calc',
  'hiload'
].forEach(function(path){
    var localMiddles = path.split('/')
      .reduce(function(res, part){
        return res.concat(Middles[part])
      },[]);
    app.get.apply(
      app, ['/without/'+path]
        .concat(localMiddles)
        .concat(setLocals)
        .concat(sendResponse)
    );

    app.get.apply(
      app, ['/with/'+path]
        .concat(wrapper(localMiddles)).concat(setLocals).concat(sendResponse)
    );
  });


var PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
  console.log('Example app listening on port '+PORT+'!');
});
