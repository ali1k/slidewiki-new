
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;
//dependent actions
var DeckActions = require('../actions/DeckActions');
var SlideActions = require('../actions/SlideActions');

module.exports = {
  // will prepare the corresponding content type e.g. deck or slide based on the selected item
  prepareContentType: function(selector) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.PREPARE_CONTENT_TYPE,
      contentType: selector.type,
      contentID: selector.id
    });
    //should load the content of corresponding content type
    switch(selector.type){
      case 'deck':
        DeckActions.loadDeck(selector.id);
      break;
      case 'slide':
        SlideActions.loadSlide(selector.id);
      break;
    }
  }

};
