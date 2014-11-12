
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;


module.exports = {
  loadDeck: function(res) {
    AppDispatcher.handleServerAction({
      actionType: ActionTypes.LOAD_DECK,
      deckID: res.id,
      content: res.content
    });
  }

};
