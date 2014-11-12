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
    var list;
    list = this.props.contributors.map(function(node, index) {
        return <li key={index}>{node.name}</li>
    });
    return (
      <div className="sw-contributors">
        <h3> Contributors </h3>
        <h4> {list} </h4>
      </div>
    )
  },
  _onChange: function() {
    this.setState(getContributorsViewState());
  }
})
module.exports= ContributorsView;
