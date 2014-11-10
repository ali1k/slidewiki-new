var React=require('react');
var Hello=require('./Hello');
var AppStore=require('../stores/AppStore');
/**
 * Retrieve the current App data from the AppStore
 */
function getAppState() {
  return {
    name: AppStore.getName()
  };
}

var App= React.createClass({
  getInitialState: function() {
    return getAppState();
  },
  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },
  render: function() {
    return (
      <Hello name={this.state.name} />
    );
  },
    /**
   * Event handler for 'change' events coming from the AppStore
   */
  _onChange: function() {
    this.setState(getAppState());
  },
});
module.exports= App;
