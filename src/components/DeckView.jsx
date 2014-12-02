'use strict';
var React = require('react');

var DeckView = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="sw-deck">
          <h3> Deck {this.props.id} </h3>
          <h4> {this.props.content.body} </h4>
          </div>
        );
    }
});

module.exports = DeckView;
