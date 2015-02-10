'use strict';
var React = require('react');
var DragDropMixin = require('react-dnd').DragDropMixin;
var ItemTypes = require('../configs/ItemTypes');
var PropTypes = React.PropTypes;
var cx = require('react/lib/cx');
var navigateAction = require('flux-router-component/actions/navigate');



var TreeNodes = React.createClass({
    mixins: [DragDropMixin],
    propTypes: {
        moveNode: PropTypes.func.isRequired,
        parentDeck: PropTypes.any.isRequired,
        frontId:PropTypes.any.isRequired,
    },
    getInitialState: function(){
        var nodes = this.props.nodes;
        
        if (nodes.children){
            var new_nodes = nodes.children.map(function(node){
            
                var new_node = node;
                new_node.frontId = node.type+node.id;
                new_node.key = new_node.frontId;
                return new_node
            });
            nodes.children = new_nodes;
        }   
        
        return {
            isDragging : false,
            nodes : nodes
        };
    },
        configureDragDrop : function(registerType) {
        var self = this;
        registerType(ItemTypes.NODE, {
            dragSource: {
                beginDrag : function() {
                    this.setState({nodes : this.state.nodes, isDragging : true});
                    return {
                        item: {
                            frontId: this.props.frontId,
                            parentDeck: this.props.parentDeck,
                            targetDeck:self
                        }
                    };
                },
                endDrag : function(){
                    self.setState({nodes : this.state.nodes, isDragging : false});
                }
            },
            dropTarget: {
                over : function(item) {
                    this.props.moveNode(item, this.props.parentDeck, this.props.frontId);
                },
                acceptDrop : function(item) {
                    item.targetDeck.refs[item.frontId].setState({isDragging : false});
                }
            }
        });
    },
    render : function() {
        var isDragging = this.state.isDragging;
        var self = this;
        //it has a fixed value
        var selector=this.props.selector;
        var context=this.props.context;
        var rootID=this.props.rootID;
        
        //handling css classes
        var isSelected= (this.props.nodes.type==this.props.selector.type && this.props.nodes.id==this.props.selector.id);

        //cx is used to handle adding classes by condition
        var nodeClasses = cx({
            'sw-tree-view-node': true,
            'sw-tree-view-selected': isSelected,
            'sw-tree-view-deck': this.props.nodes.type=='deck',
            'sw-tree-view-slide': this.props.nodes.type=='slide'
        });
        var path=this._getPath();
        var self = this;
        //handling child nodes
        var childNodes, childNumber = 0;
        if(this.props.nodes.children) {
            childNumber=this.props.nodes.children.length;
            
            var output = <ul>
                {this.props.nodes.children.map(function(node, index) {
                return (
                    <TreeNodes
                        moveNode = {self.props.moveNode}
                        nodes = {node}
                        key={node.frontId}
                        selector={self.props.selector}
                        context={self.props.context} 
                        rootID={self.props.rootID}
                        parentDeck={self}
                        frontId={node.frontId}
                        className={index==(childNumber-1)?'last-child':''}
                        ref = {node.frontId}
                    />
                );
            })}</ul>}
        
        return (
            <div className="sw-tree-view">
                <div 
                    onMouseOver={this._onMouseOver} 
                    onMouseOut={this._onMouseOut} 
                    {...this.dragSourceFor(ItemTypes.NODE)}
                    {...this.dropTargetFor(ItemTypes.NODE)}
                    style ={{
                        opacity : isDragging? 0.2 : 1
                    }}
                    >
                    <a ref="treeNode" href={path} context={this.props.context} className={nodeClasses} onClick={this._onClick}>
                      {this.props.nodes.title}
                    </a>
                    <span ref="actionBar" className="sw-hidden">
                      <i className="small ellipsis vertical icon"></i>
                      {this.props.nodes.type=='deck'? <i className="small blue icon add link"></i> :''}
                      <i className="small teal icon edit link"></i>
                      <i className="small red icon remove link"></i>
                    </span>
                </div>
                <div>{output}</div>
            </div>
        );
    },
    _onClick: function(e) {
        this.props.context.executeAction(navigateAction, {type: 'click', url: this._getPath()});
        e.preventDefault();
    },
    _getPath: function() {
        return '/deck/'+this.props.rootID+'/'+this.props.nodes.type + '/' + this.props.nodes.id;
    },
    //ToDo: add states for onMouseOver and onMouseOut events if needed
    _onMouseOver: function(e) {
        //console.log(e.target);
        var current = this.refs.treeNode.getDOMNode();
        current.className += " sw-tree-view-over"
        var actionBar = this.refs.actionBar.getDOMNode();
        actionBar.className ="";
    },
    _onMouseOut: function(e) {
        var current = this.refs.treeNode.getDOMNode();
        var re = / sw-tree-view-over/gi;
        var newClasses=current.className.replace(re, "");
        current.className=newClasses
        var actionBar = this.refs.actionBar.getDOMNode();
        actionBar.className ="sw-hidden";
    }
});


module.exports = TreeNodes;