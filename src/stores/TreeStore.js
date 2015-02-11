'use strict';
var createStore = require('fluxible/utils/createStore');
var _ = require('lodash');
var t = require('t');
var debug = require('debug');

module.exports = createStore({
  storeName: 'TreeStore',
  handlers: {
    'SHOW_DECK_TREE_START': '_showDeckTreeStart',
    'SHOW_DECK_TREE_FAILURE': '_showDeckTreeFailure',
    'SHOW_DECK_TREE_SUCCESS': '_showDeckTreeSuccess',
    'UPDATE_TREE_NODE_SELECTOR': '_updateSelector',
    'OPEN_CLOSE_TREE' : '_openCloseTree',
    'SET_IS_DRAGGING' : '_setIsDragging'
  },
  initialize: function() {
    //tree nodes
    this.nodes = {};
    //current node which is selected
    this.selector = {};
    //holds a breadcrumb based on the selector
    this.breadcrumb = [];
    this.isOpened = false;
    this.isDragging = false;
  },
  _openCloseTree : function(){
     this.isOpened = !this.isOpened;
     this.emitChange();        
  },
  _setIsDragging : function(payload){
      this.isDragging = payload.state;
      this.emitChange();
  },
  _showDeckTreeStart: function(res) {
    debug('Start loading the deck tree...');
  },
  _showDeckTreeFailure: function(res) {
    debug('Error in loading deck tree!');
    var self = this;
    this.error = true;
    self.emitChange();
  },
  _showDeckTreeSuccess: function(res) {
    debug('Success in loading deck tree!');
    this.nodes = res.nodes;
    this.selector = res.selector;
    //console.log('change emitted by Tree store!');
    this.emitChange();
    var self = this;
    this._createBreadcrumb(function(path) {
      self.breadcrumb = path;
      self.emitChange();
    });
  },
  _updateSelector: function(res) {
    this.selector = res.selector;
    var self = this;
    this._createBreadcrumb(function(path) {
      self.breadcrumb = path;
      self.emitChange();
    })
  },
  //fn callback function
  _createBreadcrumb: function(fn) {
    var found = 0;
    var self = this;
    //collect first level nodes for DFS
    var firstlevel = [];
    _.forEach(self.nodes.children, function(node) {
      if (node.type == 'deck') {
        firstlevel.push(node.id);
      }
    });
    var path = [];
    t.dfs(self.nodes, [], function(node, par, ctrl) {
      if (node.type == 'deck') {
        if (_.indexOf(firstlevel, node.id) > 0) {
          path = [{
            id: self.nodes.id,
            title: self.nodes.title
          }];
        }
        if (!found) {
          path.push({
            id: node.id,
            title: node.title
          });
        }
      }
      if (node.id == self.selector.id && node.type == self.selector.type) {
        //prevent duplicate decks in path
        if (node.type != 'deck') {
          path.push({
            id: node.id,
            title: node.title
          });
        }
        //id found
        found = 1;
        return fn(path);
      }
    })
  },
  getBreadcrumb: function() {
    return this.breadcrumb;
  },
  getNodes: function() {
    return this.nodes;
  },
  getError: function() {
      return this.error;
  },
  //this method checks if we already received the complete tree
  //it is used for preventing rendering/API calls on each request
  //todo: we can change this on update actions to reload tree
  isAlreadyComplete: function() {
    if (JSON.stringify(this.nodes) === '{}') {
      //empty
      return false;
    } else {
      return true;
    }
  },
  getRootDeckID: function() {
    return this.nodes.id;
  },
  getRootDeckTitle: function() {
    return this.nodes.title;
  },
  getSelector: function() {
    return this.selector;
  },
  getState: function(){
      return {
        nodes: this.nodes,
        selector: this.selector,
        breadcrumb: this.breadcrumb,
        isOpened: this.isOpened,
        isDragging : this.isDragging
    };
  },
  dehydrate: function() {
    return {
      nodes: this.nodes,
      selector: this.selector,
      breadcrumb: this.breadcrumb,
      isOpened: this.isOpened,
      isDragging : this.isDragging
    };
  },
  rehydrate: function(state) {
    this.nodes = state.nodes;
    this.selector = state.selector;
    this.breadcrumb = state.breadcrumb;
    this.isOpened = state.isOpened;
    this.isDragging = state.isDragging;
  }
});
