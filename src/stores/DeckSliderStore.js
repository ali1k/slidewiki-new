'use strict';
var createStore = require('fluxible-app/utils/createStore');

module.exports = createStore({
  storeName: 'DeckSliderStore',
  handlers: {
    'FILL_DECK_SLIDER_SUCCESS': '_fillDeckSliderSuccess',
    'SHOW_DECK_SUCCESS': '_showDeckSuccess',
    'SHOW_SLIDE_SUCCESS': '_showSlideSuccess'
  },
  initialize: function () {
    this.deckID=0;
    this.slides=[];
    this.currentSlide={index:0, id:0}
  },
  _fillDeckSliderSuccess: function (res) {
    this.deckID=res.id;
    this.slides=res.slides;
  },
  _showDeckSuccess: function (res) {
    this.deckID=res.id;
    this.slides=res.slides;
    var self = this;
    this.dispatcher.waitFor('DeckStore', function () {
      self.emitChange();
    });
  },
  _showSlideSuccess: function (res) {
    //we need to convert from string to int if needed
    var index = this.slides.map(function(x) {return parseInt(x.id); }).indexOf(parseInt(res.id));
    //we need index to start from 1
    this.currentSlide={index:index+1, id:res.id}
    var self = this;
    this.dispatcher.waitFor('SlideStore', function () {
      self.emitChange();
    });
  },
  isLastSlide: function (index) {
    return (index==this.slides.length);
  },
  isFirstSlide: function (index) {
    return (index==1);
  },
  getNextSlide: function () {
    if(this.isLastSlide(this.currentSlide.index)){
      return 0;
    }else{
      return this.slides[this.currentSlide.index];
    }
  },
  getPreviousSlide: function () {
    if(this.isFirstSlide(this.currentSlide.index)){
      return 0;
    }else{
      return this.slides[this.currentSlide.index-2];
    }
  },
  getSlides: function () {
    return this.slides;
  },
  getDeckID: function () {
    return this.deckID;
  },
  dehydrate: function () {
    return {
      deckID: this.deckID,
      slides: this.slides,
      currentSlide: this.currentSlide
    };
  },
  rehydrate: function (state) {
    this.deckID = state.deckID;
    this.slides = state.slides;
    this.currentSlide = state.currentSlide;
  }
});
