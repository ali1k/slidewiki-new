'use strict';
var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
//stores
var SlideStore = require('../stores/SlideStore');
//SlideWiki components
var SlideView=require('./SlideView.jsx');

var SlidePanel = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [SlideStore]
      }
    },
    getInitialState: function () {
      return this.getStateFromStores();
    },
    getStateFromStores: function () {
      return {
        content: this.getStore(SlideStore).getContent(),
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    render: function() {
        return (
          <div className="sw-slide-panel">
            <h3> SlidePanel {this.props.id} </h3>
            <SlideView id={this.props.id} content={this.state.content} context={this.props.context} />
          </div>
        );
    }
});

module.exports = SlidePanel;
