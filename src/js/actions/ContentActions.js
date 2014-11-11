
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;
//uses a web api to recieve the content of selected node
//var ContentWebAPI=require('../utils/ContentWebAPI');

module.exports = {
  prepareContentType(selector){
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.PREPARE_CONTENT_TYPE,
      contentType: selector.type,
      contentID: selector.id,
    });
    //ContentWebAPI.getContent(selector.type, selector.id);
  }
};
