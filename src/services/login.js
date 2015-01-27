'use strict';
var http = require('http');
var httpOptions = {
  host: 'localhost',
  port: 8080,
  path: '/api'
};

module.exports = {
    name: 'login',
    read: function(req, resource, params, config, callback){
        httpOptions.path = "login";
        http.get(httpOptions, function(response) {
          
          console.log(response);
        });
    }
};

