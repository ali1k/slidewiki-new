'use strict';
var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var TreeStore = require('../stores/TreeStore');
//SlideWiki components
var TreeView=require('./TreeView.jsx');

var TreePanel = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [TreeStore]
      }
    },
    getInitialState: function () {
      return this.getStateFromStores();
    },
    getStateFromStores: function () {
      return {
          nodes: this.getStore(TreeStore).getNodes(),
          selector: this.getStore(TreeStore).getSelector()
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    render: function() {
        var addButton=this.state.selector.type=='slide' ? <i className="blue add icon disabled"></i> : <i className="blue add icon"></i>
        return (
          <div className="sw-tree-panel">
            <div className="panel">
              <div className="3 fluid ui attached small icon buttons">
                <div className="ui button">
                  {addButton}
                </div>
                <div className="ui button">
                  <i className="teal edit icon"></i>
                </div>
                <div className="ui button">
                  <i className="red remove icon"></i>
                </div>
              </div>

              <div className="ui bottom attached segment sw-tree-container">
                <TreeView nodes={this.state.nodes} selector={this.state.selector} context={this.props.context} rootID={this.state.nodes.id}/>
              </div>
            </div>
          </div>
        );
    }
});

module.exports = TreePanel;
