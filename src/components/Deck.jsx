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
          <div className="container">
            <div className="row">
              <div className="col-md-12"> <DeckHeader /> </div>
            </div>
            <div className="row">
              <div className="col-md-3"> <TreePanel context={this.props.context} /> </div>
              <div className="col-md-6"> <ContentPanel context={this.props.context}/> </div>
              <div className="col-md-3"> <ContributorsPanel context={this.props.context} /> </div>
            </div>
          </div>

        );
    }
});

module.exports = Deck;
