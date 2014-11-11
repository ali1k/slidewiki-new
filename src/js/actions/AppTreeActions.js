
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
//var AppTreeWebAPI=require('../utils/AppTreeWebAPI');

module.exports = {
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
  },
  // when user selects a tree node
  selectTreeNode: function(selector){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.APP_SELECT_TREE_NODE,
      selector: selector
    });
  }

};
