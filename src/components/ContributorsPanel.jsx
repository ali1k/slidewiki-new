'use strict';
var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var ContributorsStore = require('../stores/ContributorsStore');
//SlideWiki components
var ContributorsView=require('./ContributorsView.jsx');

var ContributorsPanel = React.createClass({
  mixins: [StoreMixin],
  statics: {
    storeListeners: {
      _onChange: [ContributorsStore]
    }
  },
  getInitialState: function () {
    return this.getStateFromStores();
  },
  getStateFromStores: function () {
    return {
      contributors: this.getStore(ContributorsStore).getContributors()
    };
  },
  _onChange: function() {
    this.setState(this.getStateFromStores());
  },
    render: function() {
        return (
          <div className="sw-contributors-panel">
            <h2 className="ui header">ContributorsPanel</h2>
            <ContributorsView contributors={this.state.contributors}/>
          </div>
        );
    }
});

module.exports = ContributorsPanel;
