
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
//tree nodes
var _nodes={};
//current node which is selected
var _selector={};

/**
  private functions
 */

var _initTree= function(nodes, selector){
  _nodes=nodes;
  _selector=selector;
}
var _updateSelector= function(selector){
  _selector=selector;
}

var TreeStore = assign({}, EventEmitter.prototype, {

  /**
  public functions
   */
  getNodes: function (){
    return _nodes;
  },
  getDeckID: function (){
    //root id indicates the current deck
    return _nodes.id;
  },
  getSelector: function (){
    return _selector;
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
AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch(action.actionType) {
    case ActionTypes.LOAD_DECK_TREE:
      //init state
      _initTree(action.nodes, action.selector);
      break;
    case ActionTypes.SELECT_TREE_NODE:
      //change the selector
      _updateSelector(action.selector);
      break;

    default:
      return true;
  }

  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  TreeStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = TreeStore;
