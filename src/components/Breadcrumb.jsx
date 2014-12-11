'use strict';
var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var navigateAction = require('flux-router-component/actions/navigate');
var TreeStore = require('../stores/TreeStore');
//SlideWiki components

var Breadcrumb = React.createClass({
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
          breadcrumb: this.getStore(TreeStore).getBreadcrumb()
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    render: function() {
        var path;
        var itemNumber=this.state.breadcrumb.length
        var self=this;
        var breadcrumb = this.state.breadcrumb.map(function(node, index) {
          if(index==itemNumber-1){
            return <div key={index} className='section active'> {node.title} </div>
          }else{
            path=self._getPath('deck', node.id);
            return <div key={index} className='section'><a href={path} context={self.props.context} onClick={ self._onClick.bind(self, node.id)} > {node.title} </a><i className="right chevron icon divider"></i></div>
          }
        });
        return (
          <div className="sw-breadcrumb">
              <div className="ui breadcrumb">
                {breadcrumb}
              </div>
          </div>
        );
    },
  _getPath: function(type,id) {
      return '/deck/'+this.state.breadcrumb[0].id+'/'+type + '/' + id;
  },
  _onClick: function(id,e) {
    e.preventDefault();
    this.props.context.executeAction(navigateAction, {path: this._getPath('deck', id)});
  },
});

module.exports = Breadcrumb;
