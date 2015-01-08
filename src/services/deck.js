'use strict';
var http = require('http');
var httpOptions = {
  host: 'localhost',
  port: 8080,
  path: '/api'
};

var randomResponseTime = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  name: 'deck',
  read: function(req, resource, params, config, callback) {
    if (resource === 'deck.tree') {
      var deck_id = params.deck;
      httpOptions.path = "/api/deck/tree/" + deck_id;
      http.get(httpOptions, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
          body += d;
        });
        response.on('end', function() {
          // Data reception is done, do whatever with it!
          var parsed = JSON.parse(body);
          callback(null, {
            nodes: parsed
          });
        });
      });

      /////////////////////////////////////////////
    } else if (resource === 'deck.contributors') {
      //handle Ajax requests return object
      if (typeof(params.selector) === 'object') {
        var selector = params.selector;
      } else {
        var selector = JSON.parse(params.selector);
      }
      httpOptions.path = "/api/content/contributors/" + selector.type + "/" +
      selector.id;
      http.get(httpOptions, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
          body += d;
        });
        response.on('end', function() {
          // Data reception is done, do whatever with it!
          var parsed = JSON.parse(body);
          callback(null, {
            contributors: parsed
          });
        });
      });
      /////////////////////////////////////////////
    } else if (resource === 'deck.slideslist') {
      var deck_id = params.deck;
      //handle Ajax requests return object
      if (typeof(params.selector) === 'object') {
        var selector = params.selector;
      } else {
        var selector = JSON.parse(params.selector);
      }
      //TODO: set offset and limit
      httpOptions.path = "/api/deck/slides/" + deck_id + "/offset/1/limit/54";
      http.get(httpOptions, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
          body += d;
        });
        response.on('end', function() {
          // Data reception is done, do whatever with it!
          var parsed = JSON.parse(body);
          var res = {
            deckID: deck_id,
            currentSlideID: selector.id,
            slides: parsed.slides
          }
          callback(null, res);
        });
      });
      /////////////////////////////////////////////
    } else if (resource === 'deck.content') {
      //handle Ajax requests return object
      if (typeof(params.selector) === 'object') {
        var selector = params.selector;
      } else {
        var selector = JSON.parse(params.selector);
      }
      //separate handler for slides & decks
      switch (selector.type) {
        case 'deck':
          httpOptions.path = "/api/deck/" + selector.id;
          http.get(httpOptions, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
              body += d;
            });
            response.on('end', function() {
              // Data reception is done, do whatever with it!
              var parsed = JSON.parse(body);
              var res = {
                id: selector.id,
                type: selector.type,
                content: parsed
              }
              callback(null, res);
            });
          });
          break;
          case 'slide':
            httpOptions.path = "/api/slide/" + selector.id;
            http.get(httpOptions, function(response) {
              // Continuously update stream with data
              var body = '';
              response.on('data', function(d) {
                body += d;
              });
              response.on('end', function() {
                // Data reception is done, do whatever with it!
                var parsed = JSON.parse(body);
                var res = {
                  id: selector.id,
                  type: selector.type,
                  content: parsed
                }
                callback(null, res);
              });
            });
            break;
          }
          /////////////////////////////////////////////
        } else if (resource === 'deck.others') {

        } else {

        }
      },
      create: function(req, resource, params, body, config, callback) {

      },
      update: function(req, resource, params, body, config, callback) {

      },
      delete: function(req, resource, params, config, callback) {

      }
    };
