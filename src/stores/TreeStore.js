'use strict';
var createStore = require('fluxible-app/utils/createStore');


module.exports = createStore({
  storeName: 'TreeStore',
  handlers: {
    'SHOW_DECK_TREE_START': '_showDeckTreeStart',
    'SHOW_DECK_TREE_FAILURE': '_showDeckTreeFailure',
    'SHOW_DECK_TREE_SUCCESS': '_showDeckTreeSuccess',
    'UPDATE_TREE_NODE_SELECTOR': '_updateSelector'
  },
  initialize: function() {
    //tree nodes
    this.nodes = {};
    //current node which is selected
    this.selector = {};
  },
  _showDeckTreeStart: function(res) {
    console.log('Start loading the deck tree...');
  },
  _showDeckTreeFailure: function(res) {
    console.log('Error in loading deck tree!');
  },
  _showDeckTreeSuccess: function(res) {
    this.nodes = res.nodes;
    this.selector = res.selector;
    //console.log('change emitted by Tree store!');
    this.emitChange();
  },
  _updateSelector: function(res) {
    this.selector = res.selector;
    this.emitChange();
  },
  getNodes: function() {
    return this.nodes;
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
  dehydrate: function() {
    return {
      nodes: this.nodes,
      selector: this.selector
    };
  },
  rehydrate: function(state) {
    this.nodes = state.nodes;
    this.selector = state.selector;
  }
});
