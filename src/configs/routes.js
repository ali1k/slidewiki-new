//actions used by the routes
var initializeDeckPage = require('../actions/initializeDeckPage');

module.exports = {
  home: {
    path: '/',
    method: 'get',
    page: 'home',
    group: 'topnav',
    label: 'Home',
    action: function(context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', {
        pageTitle: 'SlideWiki | Home'
      });
      done();
    }
  },
  about: {
    path: '/about',
    method: 'get',
    page: 'about',
    group: 'topnav',
    label: 'About',
    action: function(context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', {
        pageTitle: 'SlideWiki | About'
      });
      done();
    }
  },
  deck: {
    path: '/deck/:id/:stype?/:sid?/:mode?',
    method: 'get',
    page: 'deck',
    group: 'deck-app',
    action: function(context, payload, done) {
      //node which is selected
      var selector = {};
      //mode: view, edit, questions, history, usage, comments, etc.
      var mode = '';
      if (payload.params.mode) {
        //ToDo: restrict modes to a set of predefined modes and give errors on unknown modes
        mode = payload.params.mode;
      } else {
        mode = 'view';
      }
      if (payload.params.stype && payload.params.sid) {
        selector = {
          type: payload.params.stype,
          id: payload.params.sid
        }
      } else {
        selector = {
          type: 'deck',
          id: payload.params.id
        }
      }
      //console.log(selector);
      context.executeAction(initializeDeckPage, {
        deck: payload.params.id,
        selector: selector,
        mode: mode
      }, done);
      //other actions to load deck content and contributors, etc.
      //here
    }
  }
};
