'use strict';

var randomResponseTime = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  name: 'deck',
  read: function(req, resource, params, config, callback) {
    if (resource === 'deck.tree') {
      var deck_id = params.deck;
      //we retrieve deck content from DB
      var nodes = {
        title: 'root',
        id: 1,
        type: 'deck',
        children: [{
          title: 'child 1',
          id: 11,
          type: 'slide'
        }, {
          title: 'child 2',
          id: 12,
          type: 'slide'
        }, {
          title: 'child 3',
          id: 13,
          type: 'deck',
          children: [{
            title: 'child 31',
            id: 131,
            type: 'slide'
          }, {
            title: 'child 32',
            id: 132,
            type: 'deck',
            children: [{
              title: 'child 321',
              id: 1321,
              type: 'slide'
            }, {
              title: 'child 322',
              id: 1322,
              type: 'slide'
            }, ]
          }, {
            title: 'child 33',
            id: 133,
            type: 'slide'
          }]
        }, {
          title: 'child 4',
          id: 14,
          type: 'slide'
        }]
      }
      callback(null, {
        nodes: nodes
      });
      /////////////////////////////////////////////
    } else if (resource === 'deck.contributors') {
      //handle Ajax requests return object
      if (typeof(params.selector) === 'object') {
        var selector = params.selector;
      } else {
        var selector = JSON.parse(params.selector);
      }
      var contributors = [{
        name: 'Ali Khalili',
        id: 1,
        usernmae: 'ali1k',
        role: 'creator'
      }, {
        name: 'user' + selector.id,
        id: 2
      }, {
        name: 'user' + selector.type,
        id: 3
      }]

      console.log('retrieving contributors...');
      setTimeout(function() {
        console.log('contributors retrieved!');

        callback(null, {
          contributors: contributors
        });
      }, randomResponseTime(10, 500));
      /////////////////////////////////////////////
    } else if (resource === 'deck.content') {
      //handle Ajax requests return object
      if (typeof(params.selector) === 'object') {
        var selector = params.selector;
      } else {
        var selector = JSON.parse(params.selector);
      }
      var text = 'Here comes content for item type ' + selector.type +
        ' and ID ' + selector.id;
      var res = {
        id: selector.id,
        type: selector.type,
        content: {
          body: text
        }
      }
      console.log('retrieving content...');
      setTimeout(function() {
        console.log('content retrieved!');

        callback(null, res);
      }, randomResponseTime(10, 500));
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
