var React=require('react');
//actions
var SampleActions = require('../actions/SampleActions');
//stores
var SampleStore=require('../stores/SampleStore');

function getSampleComponentState() {
  return {

  };
}
var SampleComponent= React.createClass({
  //list of properties for validation
  propTypes: {

  },
  getInitialState: function() {
    return getSampleComponentState();
  },
  componentWillMount: function() {

  },
  componentDidMount: function() {
    SampleStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    SampleStore.removeChangeListener(this._onChange);
  },
  render: function(){
    return (
      <div className="sample-class">
        <h3> SampleComponent</h3>
      </div>
    )
  },
  _onChange: function() {
    this.setState(getSampleComponentState());
  }
})
module.exports= SampleComponent;
