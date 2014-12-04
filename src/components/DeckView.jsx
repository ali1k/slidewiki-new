'use strict';
var React = require('react');
//SlideWiki components
var DeckSlider=require('./DeckSlider.jsx');

var DeckView = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="sw-deck ui segment secondary">
            <h3> Deck {this.props.id} </h3>
            <DeckSlider id={this.props.id} cover={this.props.content} context={this.props.context} />
          </div>
        );
    }
});

module.exports = DeckView;
