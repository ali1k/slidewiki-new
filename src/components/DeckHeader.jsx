'use strict';
var React = require('react');

var DeckHeader = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="ui menu sw-deck-header">
          <h2> DeckHeader </h2>
          </div>
        );
    }
});

module.exports = DeckHeader;
