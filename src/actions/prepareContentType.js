'use strict';
//payload ={selector:{type:? , id: ?}}
module.exports = function (context, payload, done) {
  context.dispatch('PREPARE_CONTENT_TYPE', payload);
  done(null);
};
