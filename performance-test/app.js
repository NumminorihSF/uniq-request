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

app.get('/without/plain', setLocals, function (req, res) {
  res.send(res.locals.response);
});

app.get('/with/plain', wrapper(setLocals), function (req, res) {
  res.send(res.locals.response);
});

app.get('/without/wait', wait, setLocals, function (req, res) {
  res.send(res.locals.response);
});

app.get('/with/wait', wrapper(wait, setLocals), function (req, res) {
  res.send(res.locals.response);
});

app.get('/without/calc', calc, setLocals, function (req, res) {
  res.send(res.locals.response);
});

app.get('/with/calc', wrapper(calc, setLocals), function (req, res) {
  res.send(res.locals.response);
});

app.get('/without/calc/wait', calc, wait, setLocals, function (req, res) {
  res.send(res.locals.response);
});

app.get('/with/calc/wait', wrapper(calc, wait, setLocals), function (req, res) {
  res.send(res.locals.response);
});

app.get('/without/wait/calc', wait, calc, setLocals, function (req, res) {
  res.send(res.locals.response);
});

app.get('/with/wait/calc', wrapper(wait, calc, setLocals), function (req, res) {
  res.send(res.locals.response);
});


app.get('/without/hiload', wait, calc, calc, wait, calc, calc, wait, calc, calc, wait, setLocals, function (req, res) {
  res.send(res.locals.response);
});

app.get('/with/hiload', wrapper(wait, calc, calc, wait, calc, calc, wait, calc, calc, wait, setLocals), function (req, res) {
  res.send(res.locals.response);
});

var PORT = process.env.port || 3000;

app.listen(PORT, function () {
  console.log('Example app listening on port '+PORT+'!');
});
