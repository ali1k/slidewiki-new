var React=require('react');
//stores
var DeckStore=require('../stores/DeckStore');

function getDeckPanelState() {
  return {

  };
}
var DeckPanel= React.createClass({
  getInitialState: function() {
    return getDeckPanelState();
  },
  componentDidMount: function() {
    DeckStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    DeckStore.removeChangeListener(this._onChange);
  },
  render: function(){
    return (
      <div className="sw-deck-panel">
        <h3> DeckPanel </h3>
      </div>
    )
  },
  _onChange: function() {
    this.setState(getDeckPanelState());
  }
})
module.exports= DeckPanel;
