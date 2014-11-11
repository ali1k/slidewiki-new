
var keyMirror = require('react/lib/keyMirror');

module.exports = {
  ActionTypes: keyMirror({
    LOAD_DECK_TREE: null,
    SELECT_TREE_NODE: null,
    LOAD_DECK_CONTENT: null,
    LOAD_SLIDE_CONTENT: null,
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })
};
