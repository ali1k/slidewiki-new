'use strict';
var React = require('react');

var Home = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="container">
            <p>Welcome to SlideWiki!</p>
            <a href="/deck/1"> Go to a sample Deck</a>
          </div>
        );
    }
});

module.exports = Home;
