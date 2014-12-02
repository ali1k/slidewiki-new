'use strict';
//payload ={selector:{type:? , id: ?}}
module.exports = function (context, payload, done) {
  context.dispatch('SHOW_CONTRIBUTORS_START', payload);
  context.service.read('deck.contributors', payload, {}, function (err, res) {
    if (err) {
      context.dispatch('SHOW_CONTRIBUTORS_FAILURE', payload);
      done(err);
      return;
    }
    context.dispatch('SHOW_CONTRIBUTORS_SUCCESS', res);
    done(null);
  });

};
