var AppTreeActions = require('../actions/AppTreeActions');

module.exports = {

  getDeckTree: function(deck_id, selector) {
    var nodes={
      title: 'root', id:1, type:'deck', children:
       [
         {title: 'child 1', id: 11, type: 'slide'},
         {title: 'child 2', id: 12, type: 'slide'},
         {title: 'child 3', id: 13, type: 'deck', children:[
          {title: 'child 31', id: 131, type: 'slide'},
          {title: 'child 32', id: 132, type: 'slide', children:[
            {title: 'child 321', id: 1321, type: 'slide'},
            {title: 'child 322', id: 1322, type: 'slide'},
          ]},
          {title: 'child 33', id: 133, type: 'slide'}
         ]},
         {title: 'child 4', id: 14, type: 'slide'}
       ]
     }
    // received data from web service, call action
    AppTreeActions.loadDeckTree(nodes, selector);
  }

};
