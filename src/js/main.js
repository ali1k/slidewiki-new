var React=require('react');
var App=require('./components/App');
//it is used for server data actions
var TreeWebAPI=require('./utils/TreeWebAPI');

//simulate loading a deck
var deck_id=1, selector={type:'slide', id:12};
//will initiate the action
TreeWebAPI.loadDeckTree(deck_id, selector);

React.renderComponent(
  <App />,
  document.getElementById('main')
);
