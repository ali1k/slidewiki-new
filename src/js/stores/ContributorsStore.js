
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _contributors;

/**
  private functions
 */


var _initContributors= function(contributors){
  _contributors=contributors;
}
var ContributorsStore = assign({}, EventEmitter.prototype, {

  /**
  public functions
   */
   getContributors: function (){
     return _contributors;
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
ContributorsStore.dispatchToken= AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    //this acts as a proxy to delegate content to its corresponding handler
    case ActionTypes.LOAD_CONTRIBUTORS:
      _initContributors(action.contributors)
    break;

    default:
      return true;
  }

  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  ContributorsStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = ContributorsStore;
