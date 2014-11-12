var React=require('react');
//stores
var DeckStore=require('../stores/DeckStore');
//actions
var DeckActions = require('../actions/DeckActions');
//SlideWiki components
var Deck=require('./Deck');

function getDeckPanelState() {
  return {
    content: DeckStore.getContent()
  };
}
var DeckPanel= React.createClass({
  //list of properties for validation
  propTypes: {
    id: React.PropTypes.number.isRequired,
  },
  getInitialState: function() {
    return getDeckPanelState();
  },
  componentWillMount: function() {
    //should load content before the component is mounted
    // runs an action to initialize content
    DeckActions.loadDeck(this.props.id);
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
        <h3> DeckPanel {this.props.id} </h3>
        <Deck id={this.props.id} content={this.state.content} />
      </div>
    )
  },
  _onChange: function() {
    this.setState(getDeckPanelState());
  }
})
module.exports= DeckPanel;
