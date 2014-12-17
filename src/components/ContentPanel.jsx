'use strict';
var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
//stores
var ContentStore = require('../stores/ContentStore');
//SlideWiki components
var DeckPanel=require('./DeckPanel.jsx');
var SlidePanel=require('./SlidePanel.jsx');

var ContentPanel = React.createClass({
  mixins: [StoreMixin],
  statics: {
    storeListeners: {
      _onChange: [ContentStore]
    }
  },
  getInitialState: function () {
    return this.getStateFromStores();
  },
  getStateFromStores: function () {
    return {
      content_type: this.getStore(ContentStore).getContentType(),
      content_id: this.getStore(ContentStore).getContentID(),
    };
  },
  _onChange: function() {
    this.setState(this.getStateFromStores());
  },
    render: function() {
        var content='';
        switch(this.state.content_type){
          case 'deck':
            content=<DeckPanel id={this.state.content_id} context={this.props.context} />;
            break;
          case 'slide':
            content=<SlidePanel id={this.state.content_id} context={this.props.context} />;
            break;
        }
        return (
          <div className="sw-content-panel">
            <div className="ui top attached tabular menu">
              <a className="active item">
                View
              </a>
              <a className="item">
                Edit
              </a>
              <a className="item">
              Questions<span className="ui tiny label">12</span>
              </a>
              <a className="item" title="Comments">
                <i className="comments red medium icon"></i>5
              </a>
              <div className="item">
                <a title="download">
                  <i className="download icon"></i>
                </a>
                <a title="print">
                  <i className="print icon"></i>
                </a>
                <a title="export">
                  <i className="share external icon"></i>
                </a>
                <a title="share">
                  <i className="share alternate icon"></i>
                </a>
              </div>
            </div>
            <div className="bottom attached panel active">
              <div className="ui segment">
                {content}
              </div>
            </div>
          </div>
        );
    }
});

module.exports = ContentPanel;
