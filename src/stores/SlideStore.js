'use strict';
var createStore = require('fluxible-app/utils/createStore');


module.exports = createStore({
  storeName: 'SlideStore',
  handlers: {
    'SHOW_SLIDE_START': '_showSlideStart',
    'SHOW_SLIDE_FAILURE': '_showSlideFailure',
    'SHOW_SLIDE_SUCCESS': '_showSlideSuccess'
  },
  initialize: function () {
    this.id=0;
    this.content={};
  },
  _showSlideStart: function (res) {
    //console.log('Start loading the deck content...');
  },
  _showSlideFailure: function (res) {
    console.log('Error loading the deck content!');
    var self  = this;
    this.error = res;
    self.emitChange();
  },
  _showSlideSuccess: function (res) {
    this.id=res.id;
    this.content=res.content;
    this.emitChange();
  },
  getContent: function (res) {
    return this.content;
  },
  getError: function() {
    return this.error;
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
