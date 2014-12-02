'use strict';
var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
//stores
var DeckStore = require('../stores/DeckStore');
//SlideWiki components
var DeckView=require('./DeckView.jsx');

var DeckPanel = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [DeckStore]
      }
    },
    getInitialState: function () {
      return this.getStateFromStores();
    },
    getStateFromStores: function () {
      return {
        content: this.getStore(DeckStore).getContent(),
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    render: function() {
        return (
          <div className="sw-deck-panel">
            <h3> DeckPanel {this.props.id} </h3>
            <DeckView id={this.props.id} content={this.state.content} context={this.props.context} />
          </div>
        );
    }
});

module.exports = DeckPanel;
