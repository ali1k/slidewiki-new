'use strict'
var async = require('async');
var TreeStore = require('../stores/TreeStore');
var DeckSliderStore = require('../stores/DeckSliderStore');
var ContributorsStore = require('../stores/ContributorsStore');

var DeckActions = {
    
    updateDeckPage: function(context, payload, done) {
  async.parallel([
      //load deck tree or only highlight a node when tree is already rendered
//      function(callback) {
//       
//          //only highlight node
//          context.executeAction(module.exports.updateTreeNodeSelector, {
//            deck: payload.deck,
//            selector: payload.selector
//          }, callback);
//       },
      ////////////////////////////////////
      //load content for deck/slide
      function(callback) {
        //first need to prepare the right container for deck/slide/etc.
        context.executeAction(module.exports.prepareContentType, {
          selector: payload.selector,
          mode: payload.mode
        }, function(res) {
          //then run the corresponding action
          switch (payload.selector.type) {
            case 'deck':
              context.executeAction(module.exports.showDeck, {
                selector: payload.selector
              }, callback);
              break;
            case 'slide':
              context.executeAction(module.exports.showSlide, {
                selector: payload.selector
              }, callback);
              break;
          }
        });
      },
      ////////////////////////////////////
      //Update contributors
      function(callback) {
        
          //only highlight node
        
            context.executeAction(module.exports.showContributors, {
              selector: payload.selector
            }, callback);
        
    },
      
      ////////////////////////////////////
      //TODO: this parallel action might be dependent on the showSlide action. we should check this later.
      //load slides for slider
      function(callback) {
        if (payload.selector.type == 'slide') {
          //show slider control
          
            //there is no need to load slides list
            context.executeAction(module.exports.updateSliderControl, {
              selector: {
                type: 'slide',
                id: payload.selector.id
              }
            }, callback);
          
        } else {
          //hide slider control
          context.executeAction(module.exports.hideSliderControl, {}, callback);
        }

      }
      ////////////////////////////////////
    ],
    // optional callback
    function(err, results) {
      if (!err) {
        //done() is the call back for initializeDeckPage action
        //when all the parallel actions are run done() will be invoked
        //update page title
//        context.dispatch('UPDATE_PAGE_TITLE', {
//          pageTitle: 'SlideWiki -- Deck ' + payload.deck + ' > ' +
//            payload.selector.type + ' : ' + payload.selector.id + ' | ' +
//            payload.mode
//        });
        done();
      }
    })},

    loadUpdateTree: function(context, payload, done){
        if (context.getStore(TreeStore).isAlreadyComplete()) {
            //only highlight node
            context.executeAction(module.exports.updateTreeNodeSelector, {
                deck: payload.deck,
                selector: payload.selector
            }, done);
        } else {
            //load the whole tree
            context.executeAction(module.exports.showDeckTree, {
                deck: payload.deck,
                selector: payload.selector
            }, done);
        }
    },
    
    updateTreeNodeSelector: function(context, payload, done){        
        context.dispatch('UPDATE_TREE_NODE_SELECTOR', {
            selector: payload.selector
        });
        done(null);
    },
    
    showDeckTree: function(context, payload, done){
        context.dispatch('SHOW_DECK_TREE_START', payload);
        
        context.service.read('deck.tree', payload, {}, function(err, res) {
            if (err) {
                context.dispatch('SHOW_DECK_TREE_FAILURE', err);
                done();
                return;
            }
            context.dispatch('SHOW_DECK_TREE_SUCCESS', {
                nodes: res.nodes,
                selector: payload.selector
            });
            //null indicates no error
            done(null);
        });
    },
    
    
   
    loadContainer: function(context, payload, done){
        //first need to prepare the right container for deck/slide/etc.
        context.executeAction(module.exports.prepareContentType, {
            selector: payload.selector,
            mode: payload.mode
        }, function(res) {
          //then run the corresponding action
            switch (payload.selector.type) {
                case 'deck':
                    context.executeAction(module.exports.showDeck, {
                        selector: payload.selector
                    }, done);
                    break;
                case 'slide':
                    context.executeAction(module.exports.showSlide, {
                        selector: payload.selector
                    }, done);
                    break;
            }
        });
    },
    
    prepareContentType: function (context, payload, done) {
        context.dispatch('PREPARE_CONTENT_TYPE', payload);
        done(null);
    },
    
    showDeck: function (context, payload, done) {
        context.dispatch('SHOW_DECK_START', payload);
        context.service.read('deck.content', payload, {}, function (err, res) {
            if (err) {
                context.dispatch('SHOW_DECK_FAILURE', err);
                done();
                return;
            }
            context.dispatch('SHOW_DECK_SUCCESS', res);
                done(null);
        });
    },
    
    showSlide: function (context, payload, done) {
        context.dispatch('SHOW_SLIDE_START', payload);
        context.service.read('deck.content', payload, {}, function (err, res) {
            if (err) {
                context.dispatch('SHOW_SLIDE_FAILURE', err);
                done();
                return;
            }
            context.dispatch('SHOW_SLIDE_SUCCESS', res);
                done(null);
        });
    },
    
    loadContributors: function(context, payload, done){
        context.executeAction(module.exports.showContributors, {
            selector: payload.selector
        });
    },
    
    showContributors: function (context, payload, done) {
        context.dispatch('SHOW_CONTRIBUTORS_START', payload);
        context.service.read('deck.contributors', payload, {}, function (err, res) {
            if (err) {
                context.dispatch('SHOW_CONTRIBUTORS_FAILURE', err);
                return;
            }
            context.dispatch('SHOW_CONTRIBUTORS_SUCCESS', res);
        });

    },
    
    loadSlides : function(context, payload, done){             
        if (payload.selector.type === 'slide') {
            //show slider control
            if (context.getStore(DeckSliderStore).isAlreadyComplete()) {
              //there is no need to load slides list
                context.executeAction(module.exports.updateSliderControl, {
                    selector: {
                        type: 'slide',
                        id: payload.selector.id
                    }
                }, done);
            } else {
              //reload slides list
              context.executeAction(this.showSliderControl, {
                    deck: payload.deck,
                    selector: {
                        type: 'slide',
                        id: payload.selector.id
                    }
              }, done);
            }
        } else {
                //hide slider control
                context.executeAction(this.hideSliderControl, {}, done);
        }
    },
    
    updateSliderControl: function(context, payload, done) {
        context.dispatch('UPDATE_SLIDER_CONTROL', {
            currentSlideID: payload.selector.id
        });
        done(null);
    },
    
    showSliderControl: function(context, payload, done) {
        context.dispatch('SHOW_SLIDER_CONTROL_START', payload);
        context.service.read('deck.slideslist', payload, {}, function(err, res) {
            if (err) {
                context.dispatch('SHOW_SLIDER_CONTROL_FAILURE', err);
                done();
                return;
            }
            context.dispatch('SHOW_SLIDER_CONTROL_SUCCESS', res);
            done(null);
        });

    },
    
    hideSliderControl: function (context, payload, done) {
        context.dispatch('HIDE_SLIDER_CONTROL');
        done(null);
    },
    
    updateTitle: function(context, payload, done){
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: 'SlideWiki -- Deck ' + payload.deck + ' > ' +
                payload.selector.type + ' : ' + payload.selector.id + ' | ' +
                payload.mode
        });
        done();
    }
            
     
    
        
     

};

module.exports = DeckActions;


