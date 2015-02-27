'use strict';
var React = require('react');
var cx = require('react/lib/cx');
var navigateAction = require('flux-router-component/actions/navigate');
var StoreMixin = require('fluxible').Mixin;
//stores
var ContentStore = require('../stores/ContentStore');
//SlideWiki components
var DeckPanel=require('./DeckPanel.jsx');
var SlidePanel=require('./SlidePanel.jsx');
var SlideEditor = require('./SlideEditor.jsx');
var deckActions = require('../actions/DeckActions');


var SlideEditor = React.createClass({
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
      mode: this.getStore(ContentStore).getMode(),
      theme_name: 'night'
    };
  },
  _onChange: function() {
    this.setState(this.getStateFromStores());
  },
  componentDidMount : function(){
     //var $editor = $(this.getDOMNode()).wysiwyg({});
    },
    
  render: function(){
      return (<div><textarea id="sw-wysiwyg">This is SlideEditor</textarea></div>)
  }
});

module.exports = SlideEditor;