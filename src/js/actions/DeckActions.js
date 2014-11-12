
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;


module.exports = {
  loadDeck: function(id) {
    AppDispatcher.handleServerAction({
      actionType: ActionTypes.LOAD_DECK,
      deckID: id,
      content: {body:'content from deck '+id}
    });
  }

};
