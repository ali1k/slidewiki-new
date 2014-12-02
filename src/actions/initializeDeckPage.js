'use strict';
var async= require('async');
var showDeckTree = require('../actions/showDeckTree');
var showContributors = require('../actions/showContributors');
var prepareContentType = require('../actions/prepareContentType');
var showDeck = require('../actions/showDeck');
var showSlide = require('../actions/showSlide');

//payload ={deck:? , selector: {type:? , id: ?}}
module.exports = function (context, payload, done) {

  async.parallel([
    //load deck tree
    function(callback){
      context.executeAction(showDeckTree, {deck: payload.deck, selector: payload.selector}, callback);
    },
    ////////////////////////////////////
    //load content for deck/slide
    function(callback){
      //first need to prepare the right container for deck/slide/etc.
      context.executeAction(prepareContentType, {selector: payload.selector}, function(res){
        //then run the corresponding action
        switch(payload.selector.type){
          case 'deck':
            context.executeAction(showDeck, {selector: payload.selector}, callback);
          break;
          case 'slide':
            context.executeAction(showSlide, {selector: payload.selector}, callback);
          break;
        }
      });
    },
    ////////////////////////////////////
    //load contributors
    function(callback){
      context.executeAction(showContributors, {selector: payload.selector}, callback);
    },
    ////////////////////////////////////
    ],
    // optional callback
    function(err, results){
        if(!err){
          //done() is the call back for initializeDeckPage action
          //when all the parallel actions are run done() will be invoked
          done();
        }
    });
};
