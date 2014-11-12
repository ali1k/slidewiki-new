
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;


module.exports = {
  loadSlide: function(id) {
    AppDispatcher.handleServerAction({
      actionType: ActionTypes.LOAD_SLIDE,
      slideID: id,
      content: {body: 'content for slide '+id}
    });
  }
};
