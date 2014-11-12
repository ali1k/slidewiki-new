
var keyMirror = require('react/lib/keyMirror');

module.exports = {
  ActionTypes: keyMirror({
    LOAD_DECK_TREE: null,
    SELECT_TREE_NODE: null,
    PREPARE_CONTENT_TYPE: null,
    LOAD_DECK: null,
    LOAD_SLIDE: null,
    LOAD_CONTRIBUTORS: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })
};
