
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
//deck id
var _content_type;
var _content_id;
/**
  private functions
 */
var _initContent= function(ontent_type, content_id){
  _content_type=ontent_type;
  _content_id=content_id;
}

var ContentStore = assign({}, EventEmitter.prototype, {

  /**
  public functions
   */
   getContentType: function (){
     return _content_type;
   },
   getContentID: function (){
     //root id indicates the current deck
     return _content_id;
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
ContentStore.dispatchToken= AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    //this acts as a proxy to delegate content to its corresponding handler
    case ActionTypes.PREPARE_CONTENT_TYPE:
      _initContent(action.contentType, action.contentID)
    break;

    default:
      return true;
  }

  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  ContentStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = ContentStore;
