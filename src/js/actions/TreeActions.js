
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;

module.exports = {
  /**
   * @param  {object} nodes
   * @param  {object} selector : defines the node which must be selected e.g. {type:"slide", id: 12}
   */
  loadDeckTree: function(nodes, selector) {
    AppDispatcher.handleServerAction({
      actionType: ActionTypes.LOAD_DECK_TREE,
      nodes: nodes,
      selector: selector
    });
  },
  // when user selects a tree node
  selectTreeNode: function(selector){
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.SELECT_TREE_NODE,
      selector: selector
    });
  }

};
