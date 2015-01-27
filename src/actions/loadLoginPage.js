'use strict';


module.exports = function(context, payload, done) {

  context.dispatch('SHOW_LOGIN_PAGE_START', payload);

  context.service.read('login', payload, {}, function(err, res) {
    if (err) {
      context.dispatch('SHOW_LOGIN_PAGE_FAILURE', payload);
      done(err);
      return;
    }
    context.dispatch('SHOW_LOGIN_PAGE_SUCCESS', {
      
    });
    //null indicates no error
    done(null);
  });

};

