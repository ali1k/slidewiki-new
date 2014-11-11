var React=require('react');
//stores
var SlideStore=require('../stores/SlideStore');

function getSlidePanelState() {
  return {

  };
}
var SlidePanel= React.createClass({
  getInitialState: function() {
    return getSlidePanelState();
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
        <h3> SlidePanel </h3>
      </div>
    )
  },
  _onChange: function() {
    this.setState(getSlidePanelState());
  }
})
module.exports= SlidePanel;
