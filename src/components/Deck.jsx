'use strict';
var React = require('react');
var DeckHeader = require('./DeckHeader.jsx');
var TreePanel = require('./TreePanel.jsx');
var ContentPanel = require('./ContentPanel.jsx');
var ContributorsPanel = require('./ContributorsPanel.jsx');

var Deck = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="ui vertically padded grid page">
            <div className="row">
              <div className="column">
                <h2 className="ui header"><DeckHeader /></h2>
              </div>
            </div>

            <div className="ui hidden divider"></div>

            <div className="row">
              <div className="four wide column">
                <TreePanel context={this.props.context} />
              </div>
              <div className="nine wide column">
                <ContentPanel context={this.props.context}/>
              </div>
              <div className="three wide column">
                <ContributorsPanel context={this.props.context} />
              </div>
            </div>
          </div>
        );
    }
});

module.exports = Deck;
