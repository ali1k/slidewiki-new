var React=require('react');


function getDeckViewState() {
  return {

  };
}
var DeckView= React.createClass({
  //list of properties for validation
  propTypes: {
    id: React.PropTypes.number.isRequired,
    content: React.PropTypes.object
  },
  getInitialState: function() {
    return getDeckViewState();
  },
  componentWillMount: function() {

  },
  componentDidMount: function() {

  },
  componentWillUnmount: function() {

  },
  render: function(){
    return (
      <div className="sw-deck">
        <h3> Deck {this.props.id} </h3>
        <h4> {this.props.content.body} </h4>
      </div>
    )
  },
  _onChange: function() {
    this.setState(getDeckViewState());
  }
})
module.exports= DeckView;
