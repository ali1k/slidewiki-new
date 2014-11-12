var React=require('react');


function getContributorsViewState() {
  return {

  };
}
var ContributorsView= React.createClass({
  //list of properties for validation
  propTypes: {

  },
  getInitialState: function() {
    return getContributorsViewState();
  },
  componentWillMount: function() {

  },
  componentDidMount: function() {

  },
  componentWillUnmount: function() {

  },
  render: function(){
    return (
      <div className="sw-contributors">
        <h3> Contributors </h3>
        <h4> {this.props.contributors[1].name}</h4>
      </div>
    )
  },
  _onChange: function() {
    this.setState(getContributorsViewState());
  }
})
module.exports= ContributorsView;
