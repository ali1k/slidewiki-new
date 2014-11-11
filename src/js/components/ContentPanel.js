var React=require('react');
//stores
var ContentStore=require('../stores/ContentStore');

function getContentPanelState() {
  return {
    content:{
      type: ContentStore.getContentType(),
      id: ContentStore.getContentID()
    }
  };
}
var ContentPanel= React.createClass({
  getInitialState: function() {
    return getContentPanelState();
  },
  componentDidMount: function() {
    ContentStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    ContentStore.removeChangeListener(this._onChange);
  },
  render: function(){
    return (
      <div className="sw-content-panel">
        <h2> ContentPanel </h2>
        <h3> Content Type: <b> {this.state.content.type} </b> </h3>
      </div>
    )
  },
  _onChange: function() {
    this.setState(getContentPanelState());
  }
})
module.exports= ContentPanel;
