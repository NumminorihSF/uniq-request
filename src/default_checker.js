"use strict";
module.exports = function(req, res){
  return req.method+':'+req.originalPath;
};