'use strict';
var React = require('react');
var StoreMixin = require('fluxible').Mixin;

var TreeStore = require('../stores/TreeStore');
var deckActions = require('../actions/DeckActions');
var TreeNodes = require('./TreeNodes.jsx');



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
                new_node.key = new_node.frontId;                
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
    moveNode : function(item, targetDeck, frontAfterId) {
        var frontId = item.frontId;
        //set moving state for opacity
        if(targetDeck.refs[item.frontId]){
            targetDeck.refs[item.frontId].setState({isDragging : true});
        }
        var parentDeck = item.parentDeck;
        var parentState = item.parentDeck.state;
        var targetState = targetDeck.state;
        //search a moving node
        var node = parentState.nodes.children.filter(function(i){return i.frontId===frontId})[0];  
        //search a current place for dropping
        var afterNode = targetState.nodes.children.filter(function(i){return i.frontId===frontAfterId})[0];   
        var nodeIndex = parentState.nodes.children.indexOf(node);
        var afterIndex = targetState.nodes.children.indexOf(afterNode);
        //remove moving node
        parentState.nodes.children.splice(nodeIndex, 1);
        //insert moving node to a new place
        targetState.nodes.children.splice(afterIndex, 0, node);
        //update current deck
        item.parentDeck = targetDeck;
        //update both source and target decks
        parentDeck.setState(parentState);
        targetDeck.setState(targetState);
        //update moving item
        item.targetDeck = targetDeck;
        
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
                <TreeNodes nodes={this.state.nodes} parentDeck={null} frontId="{null}" moveNode={this.moveNode} selector={this.state.selector} context={this.props.context} rootID={this.state.nodes.id}/>
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
