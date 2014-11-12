
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;
//dependent Web APIs
var ContentWebAPI = require('../utils/ContentWebAPI');

module.exports = {
  // will prepare the corresponding content type e.g. deck or slide based on the selected item
  prepareContentType: function(selector) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.PREPARE_CONTENT_TYPE,
      contentType: selector.type,
      contentID: selector.id
    });

    //should load the content of corresponding content type
    ContentWebAPI.loadContent(selector.type, selector.id);
  }

};
