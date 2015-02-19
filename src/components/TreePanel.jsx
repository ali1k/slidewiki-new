'use strict';
var React = require('react');
var StoreMixin = require('fluxible').Mixin;

var TreeStore = require('../stores/TreeStore');
var deckActions = require('../actions/DeckActions');
var treeActions = require('../actions/TreeActions');
var TreeNodes = require('./TreeNodes.jsx');
var updateSliderControl = require('../actions/updateSliderControl');


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
          error: this.getStore(TreeStore).getError(),
          nodes: this.getStore(TreeStore).getNodes(),
          selector: this.getStore(TreeStore).getSelector(),
          dragging: this.getStore(TreeStore).getDragging(),
          allowDrop: this.getStore(TreeStore).getAllowDrop(),
          selected: this.getStore(TreeStore).getSelected()
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },

    deleteFrom : function(){
        var payload = this.state.selected;
        this.props.context.executeAction(treeActions.deleteFrom, payload);
    },
    addEmptySlide : function(){
        var self = this;
        var payload = {title: 'New Slide', 
                       user_id: 3, 
                       body : '', 
                       language: 'en', 
                       position : null };
        this.props.context.executeAction(treeActions.addEmptySlide, payload, function(){
            this.props.context.executeAction(navigateAction, {type: 'click', url: '/deck/'+this.state.nodes.id+'/slide/' + this.state.selector.id});
        });
    },

    render: function() {

        var tree
        var addButton=this.state.selector.type=='slide' ? <i className="blue add icon disabled"></i> : <i className="blue add icon"></i>;
        if (!this.state.error) {
          tree = <div className="sw-tree-panel">
            <div className="panel">
              <div className="3 fluid ui attached small icon buttons">
                <div className="ui button" onClick = {this.addEmptySlide}>
                  {addButton}
                </div>
                <div className="ui button">
                  <i className="teal edit icon"></i>
                </div>
                <div className="ui button" onClick = {this.deleteFrom}>
                  <i className="red remove icon"></i>
                </div>
              </div>
              
              <div className="ui bottom attached segment sw-tree-container">
                <TreeNodes 
                            key={'deck'+this.state.nodes.position+this.state.nodes.id}
                            item={this.state.nodes}
                            position={1}
                            parentID={0}
                            rootID={this.state.nodes.id}
                            selector={this.state.selector} 
                            dragging={this.state.dragging}
                            isOpened={true} 
                            context={this.props.context}
                            ref={'deck'+this.state.nodes.id}
                            parentRef={'0'}
                            allowDrop={this.state.allowDrop}
                            parent = {this}
                />
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
