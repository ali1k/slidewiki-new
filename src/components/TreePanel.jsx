'use strict';
var React = require('react');
var StoreMixin = require('fluxible').Mixin;

var TreeStore = require('../stores/TreeStore');
var TreeView=require('./TreeView.jsx');
var deckActions = require('../actions/DeckActions');
var Container = require('./Container.jsx');



var TreePanel = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [TreeStore]
      }
    },
    getInitialState: function () {
        var state = this.getStateFromStores();
        var nodes = state.nodes;
        nodes.frontId = nodes.type+nodes.id;
        if (nodes.children){
            var new_nodes = nodes.children.map(function(node){
            
                var new_node = node;
                new_node.frontId = node.type+node.id;
                return new_node
            });
            nodes.children = new_nodes;
        } 
        state.nodes = nodes;
        return state;
        
    },
    getStateFromStores: function () {
      return {
          error: this.getStore(TreeStore).getError(),
          nodes: this.getStore(TreeStore).getNodes(),
          selector: this.getStore(TreeStore).getSelector()
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    moveNode : function(frontId, frontAfterId) {
        var node = this.state.nodes.children.filter(function(i){return i.frontId===frontId})[0];
        var afterNode = this.state.nodes.children.filter(function(i){return i.frontId===frontAfterId})[0];        
        var nodeIndex = this.state.nodes.children.indexOf(node);        
        var afterIndex = this.state.nodes.children.indexOf(afterNode);
        this.state.nodes.children.splice(nodeIndex, 1);
        this.state.nodes.children.splice(afterIndex, 0, node);
        this.setState({nodes : this.state.nodes});
    },
    
    render: function() {

        var tree
        var addButton=this.state.selector.type=='slide' ? <i className="blue add icon disabled"></i> : <i className="blue add icon"></i>
        if (!this.state.error) {
          tree = <div className="sw-tree-panel">
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
                <Container nodes={this.state.nodes} moveNode={this.moveNode} selector={this.state.selector} context={this.props.context} rootID={this.state.nodes.id}/>
              </div>
            </div>
          </div>
        }else{
        tree = <div className="sw-tree-panel">{this.state}</div>
        } 

        return (
          <div>{tree}</div>
        )
    },
    componentDidMount: function() {
      //make the selected node visible in the view
      $(".sw-tree-view-selected").scrollIntoView();

    //    var payload = {deck:this.props.rootDeckID, mode: 'view', selector : {id :this.props.rootDeckID, type: 'deck'}};
    //    this.props.context.executeAction(deckActions.loadUpdateTree, payload);
      
    },
    componentDidUpdate: function() {
      //make the selected node visible in the view
      $(".sw-tree-view-selected").scrollIntoView();
    }
});

module.exports = TreePanel;
