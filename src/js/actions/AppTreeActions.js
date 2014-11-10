
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AppTreeWebAPI=require('../utils/AppTreeWebAPI');

var AppTreeActions = {

  /**
   * @param  {object} nodes
   * @param  {int} deck id
   * @param  {object} selector : defines the node which must be selected e.g. {type:"slide", id: 12}
   */
  loadDeckTree: function(nodes, deck_id, selector) {
    AppDispatcher.handleServerAction({
      actionType: AppConstants.APP_LOAD_DECK_TREE,
      nodes: nodes,
      deck_id: deck_id,
      selector: selector
    });
  }
};

module.exports = AppTreeActions;
