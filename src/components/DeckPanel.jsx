'use strict';
var React = require('react');
var StoreMixin = require('fluxible').Mixin;
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
            <div className="panel">
              <div className="ui secondary top yellow attached segment">
                {this.state.content.title}
              </div>
              <div className="ui bottom attached segment">
                <DeckView id={this.props.id} content={this.state.content} context={this.props.context} />
              </div>
            </div>
          </div>
        );
    }
});

module.exports = DeckPanel;
