
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;
//dependent actions
var ContentActions = require('../actions/ContentActions');
//dependent Web APIs
var ContributorsWebAPI = require('../utils/ContributorsWebAPI');

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
    //should also load the corresponding content type
    ContentActions.prepareContentType(selector);
    //should load the contributors too
    ContributorsWebAPI.loadContributors(selector);
  },
  // when user selects a tree node
  selectTreeNode: function(selector){
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.SELECT_TREE_NODE,
      selector: selector
    });
    ContentActions.prepareContentType(selector);
    ContributorsWebAPI.loadContributors(selector);
  }

};
