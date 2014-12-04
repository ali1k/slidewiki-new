'use strict';
//this action will load a list of slides for the slider based on the root deck
module.exports = function (context, payload, done) {
  context.dispatch('FILL_DECK_SLIDER_START', payload);
  context.service.read('deck.content', payload, {}, function (err, res) {
    if (err) {
      context.dispatch('FILL_DECK_SLIDER_FAILURE', payload);
      done(err);
      return;
    }
    context.dispatch('FILL_DECK_SLIDER_SUCCESS', res);
    done(null);
  });

};
