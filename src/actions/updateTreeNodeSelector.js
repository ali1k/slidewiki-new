'use strict';
//payload ={selector:{type:? , id: ?}}
module.exports = function(context, payload, done) {
  context.dispatch('UPDATE_TREE_NODE_SELECTOR', {
    selector: payload.selector
  });
  done(null);
};
