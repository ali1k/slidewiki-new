'use strict';
//payload ={selector:{type:? , id: ?}}
module.exports = function (context, payload, done) {
  context.dispatch('SHOW_DECK_START', payload);
  context.service.read('deck.content', payload, {}, function (err, res) {
    if (err) {
      context.dispatch('SHOW_DECK_FAILURE', payload);
      done(err);
      return;
    }
    context.dispatch('SHOW_DECK_SUCCESS', res);
    done(null);
  });

};
