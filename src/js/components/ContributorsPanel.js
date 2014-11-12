var React=require('react');
//stores
var ContributorsStore=require('../stores/ContributorsStore');
//SlideWiki components
var ContributorsView=require('./ContributorsView');

function getContributorsPanelState() {
  return {
    contributors: ContributorsStore.getContributors()
  };
}

var ContributorsPanel= React.createClass({
  //list of properties for validation
  propTypes: {

  },
  getInitialState: function() {
    return getContributorsPanelState();
  },
  componentWillMount: function() {

  },
  componentDidMount: function() {
    ContributorsStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    ContributorsStore.removeChangeListener(this._onChange);
  },
  render: function(){
    return (
      <div className="sw-contributors-panel">
        <h2> ContributorsPanel </h2>
        <ContributorsView contributors={this.state.contributors}/>
      </div>
    )
  }
})
module.exports= ContributorsPanel;
