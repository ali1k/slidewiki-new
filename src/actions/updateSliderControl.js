'use strict';
//payload ={selector:{type:? , id: ?}}
module.exports = function(context, payload, done) {
  context.dispatch('UPDATE_SLIDER_CONTROL', {
    currentSlideID: payload.selector.id
  });
  done(null);
};
