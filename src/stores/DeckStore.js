'use strict';
var createStore = require('fluxible/utils/createStore');
var agent = require('superagent');
var api = require('../configs/config').api;
//error messages: 
var internal =  {message : 'An internal error occured, please try one more time'};


module.exports = createStore({
  storeName: 'DeckStore',
  handlers: {
    'SHOW_DECK_START': '_showDeckStart',
    'SHOW_DECK_FAILURE': '_showDeckFailure',
    'SHOW_DECK_SUCCESS': '_showDeckSuccess',
    'TRANSLATE_TO' : 'translate_to'
  },
  initialize: function () {
    this.id = 0;
    this.content={};
  },
  _showDeckStart: function (res) {
    //console.log('Start loading the deck content...');
  },
  _showDeckFailure: function (res) {
    console.log('Error loading the deck content!');
    this.error = res;
    this.emitChange();
  },
  _showDeckSuccess: function (res) {
    this.id = res.id;
    this.content = res.content;
    this.emitChange();
  },
  translate_to : function(payload){
      var self = this;
      agent
                .get(api.path + '/translate/' + payload.language + '/deck/' + payload.id)
                .end(function(err, res){
                    if (err){
                        self.error = internal;
                        return self.emitChange();
                    }else{
                        console.log(res.body);
                        self.id = res.body.id;
                        self.content = res.body;
                        self.emitChange();
                    }
                });
     
    //todo(api/translate...) 
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
