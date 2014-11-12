
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;


module.exports = {
  loadSlide: function(res) {
    AppDispatcher.handleServerAction({
      actionType: ActionTypes.LOAD_SLIDE,
      slideID: res.id,
      content: res.content
    });
  }
};
