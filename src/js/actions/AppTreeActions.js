
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AppTreeWebAPI=require('../utils/AppTreeWebAPI');

var AppTreeActions = {

  /**
   * @param  {object} nodes
   * @param  {object} selector : defines the node which must be selected e.g. {type:"slide", id: 12}
   */
  loadDeckTree: function(nodes, selector) {
    AppDispatcher.handleServerAction({
      actionType: AppConstants.APP_LOAD_DECK_TREE,
      nodes: nodes,
      selector: selector
    });
  }
};

module.exports = AppTreeActions;
