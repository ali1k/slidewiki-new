var React=require('react');
//stores
var ContentStore=require('../stores/ContentStore');
//SlideWiki components
var DeckPanel=require('./DeckPanel');
var SlidePanel=require('./SlidePanel');

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
    var content='';
    switch(this.state.content.type){
      case 'deck':
        content=<DeckPanel />;
      break;
      case 'slide':
        content=<SlidePanel />;
      break;
    }
    return (
      <div className="sw-content-panel">
        <h2> ContentPanel </h2>
        {content}
      </div>
    )
  },
  _onChange: function() {
    this.setState(getContentPanelState());
  }
})
module.exports= ContentPanel;
