'use strict';

module.exports = function (context, payload, done) {
  context.dispatch('HIDE_SLIDER_CONTROL');
  done(null);
};
