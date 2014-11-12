var React=require('react');
//stores
var SlideStore=require('../stores/SlideStore');
//actions
var SlideActions = require('../actions/SlideActions');
//SlideWiki components
var Slide=require('./Slide');

function getSlidePanelState() {
  return {
    content: SlideStore.getContent()
  };
}
var SlidePanel= React.createClass({
  //list of properties for validation
  propTypes: {
    id: React.PropTypes.number.isRequired
  },
  getInitialState: function() {
    return getSlidePanelState();
  },
  componentWillMount: function() {

  },
  componentDidMount: function() {
    SlideStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    SlideStore.removeChangeListener(this._onChange);
  },
  render: function(){
    return (
      <div className="sw-slide-panel">
        <h3> SlidePanel {this.props.id} </h3>
        <Slide id={this.props.id} content={this.state.content} />
      </div>
    )
  },
  _onChange: function() {
    this.setState(getSlidePanelState());
  }
})
module.exports= SlidePanel;
