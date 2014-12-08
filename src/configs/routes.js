//actions used by the routes
var initializeDeckPage = require('../actions/initializeDeckPage');

module.exports = {
    home: {
        path: '/',
        method: 'get',
        page: 'home',
        group: 'topnav',
        label: 'Home'
    },
    about: {
        path: '/about',
        method: 'get',
        page: 'about',
        group: 'topnav',
        label: 'About'
    },
    deck: {
        path: '/deck/:id/:stype?/:sid?',
        method: 'get',
        page: 'deck',
        group: 'deck-app',
        action:function (context, payload, done) {
          var selector={};
          if(payload.params.stype && payload.params.sid){
            selector={type: payload.params.stype, id: payload.params.sid}
          }else{
            selector={type: 'deck', id: payload.params.id}
          }
          //console.log(selector);
          context.executeAction(initializeDeckPage, {deck: payload.params.id, selector: selector}, done);
          //other actions to load deck content and contributors, etc.
          //here
        }
    },
};
