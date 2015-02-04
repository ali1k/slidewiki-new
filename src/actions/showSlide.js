'use strict';
//payload ={selector:{type:? , id: ?}}
module.exports = function (context, payload, done) {
  context.dispatch('SHOW_SLIDE_START', payload);
  context.service.read('deck.content', payload, {}, function (err, res) {
    if (err) {
      context.dispatch('SHOW_SLIDE_FAILURE', err);
      done();
      return;
    }
    context.dispatch('SHOW_SLIDE_SUCCESS', res);
    done(null);
  });

};
