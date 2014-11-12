
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;
var assign = require('object-assign');
//dependent stores
var ContentStore = require('./ContentStore');

var CHANGE_EVENT = 'change';
//deck id
var _deck={id: null, content:{}};

/**
  private functions
 */
var _initDeck= function(id, content){
  _deck.id=id;
  _deck.content=content;
}


var DeckStore = assign({}, EventEmitter.prototype, {

  /**
  public functions
   */
  getContent: function(){
    return   _deck.content;
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register to handle all updates
DeckStore.dispatchToken= AppDispatcher.register(function(payload) {
  //should wait until content type has finished working
  AppDispatcher.waitFor([
    ContentStore.dispatchToken
  ]);
  var action = payload.action;

  switch(action.actionType) {
    case ActionTypes.LOAD_DECK:
      _initDeck(action.deckID, action.content)
    break;

    default:
      return true;
  }

  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  DeckStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = DeckStore;
