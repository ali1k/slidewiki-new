
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;


module.exports = {
  loadContributors: function(res) {
    AppDispatcher.handleServerAction({
      actionType: ActionTypes.LOAD_CONTRIBUTORS,
      contributors: res
    });
  }

};
