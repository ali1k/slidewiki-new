
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;


module.exports = {
  loadSlide: function(content) {
    AppDispatcher.handleServerAction({
      actionType: ActionTypes.LOAD_SLIDE,
      content: content
    });
  }
};
