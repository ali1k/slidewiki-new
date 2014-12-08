'use strict';
var createStore = require('fluxible-app/utils/createStore');


module.exports = createStore({
  storeName: 'DeckStore',
  handlers: {
    'SHOW_DECK_START': '_showDeckStart',
    'SHOW_DECK_FAILURE': '_showDeckFailure',
    'SHOW_DECK_SUCCESS': '_showDeckSuccess'
  },
  initialize: function () {
    this.id=0;
    this.content={};
  },
  _showDeckStart: function (res) {
    //console.log('Start loading the deck content...');
  },
  _showDeckFailure: function (res) {
    //console.log('Error loading the deck content!');
  },
  _showDeckSuccess: function (res) {
    this.id=res.id;
    this.content=res.content;
    this.emitChange();
  },
  getContent: function (res) {
    return this.content;
  },
  dehydrate: function () {
    return {
      id: this.id,
      content: this.content
    };
  },
  rehydrate: function (state) {
    this.id = state.id;
    this.content = state.content;
  }
});
