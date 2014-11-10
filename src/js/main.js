var React=require('react');
var AppActions=require('./actions/AppActions');
var App=require('./components/App');
AppActions.sayHello('Ali');
React.renderComponent(
  <App />,
  document.getElementById('main')
);
