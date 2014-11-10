

var AppTreeActions = require('../actions/AppTreeActions');


module.exports = {

  loadDeckTree: function(deck_id, selector) {
    var nodes={
      title: 'root', id:1, type:"deck", children:
       [
       {title: 'child 1', id: 11, type: 'slide'},
       {title: 'child 2', id: 12, type: 'slide'}
       ]
     }
    // receive data from web service
    AppTreeActions.loadDeckTree(nodes, deck_id, selector);
  }

};
