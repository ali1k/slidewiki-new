'use strict';

//payload ={deck:? , selector: {type:? , id: ?}}
module.exports = function(context, payload, done) {

  context.dispatch('SHOW_DECK_TREE_START', payload);

  context.service.read('deck.tree', payload, {}, function(err, res) {
    if (err) {
      context.dispatch('SHOW_DECK_TREE_FAILURE', payload);
      done(err);
      return;
    }
    context.dispatch('SHOW_DECK_TREE_SUCCESS', {
      nodes: res.nodes,
      selector: payload.selector
    });
    //null indicates no error
    done(null);
  });

};
