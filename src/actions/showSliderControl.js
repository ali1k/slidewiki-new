'use strict';
//this action will load a list of slides for the slider based on the root deck
module.exports = function(context, payload, done) {
  context.dispatch('SHOW_SLIDER_CONTROL_START', payload);
  
  context.service.read('deck.slidelist', payload, {}, function(err, res) {
    
    if (err) {
      context.dispatch('SHOW_SLIDER_CONTROL_FAILURE', err);
      done();
      return;
    }
    context.dispatch('SHOW_SLIDER_CONTROL_SUCCESS', res);
    done();
  });

};
