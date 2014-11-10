var React=require('react');
var App=require('./components/App');
//it is used for server data actions
var AppTreeWebAPI=require('./utils/AppTreeWebAPI');

//simulate loading a deck
var deck_id=1, selector={type:'slide', id:12};
//will initiate the action
AppTreeWebAPI.getDeckTree(deck_id, selector);

React.renderComponent(
  <App />,
  document.getElementById('main')
);
