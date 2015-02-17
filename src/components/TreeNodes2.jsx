'use strict';
var React = require('react');
var DragDropMixin = require('react-dnd').DragDropMixin;
var ItemTypes = require('../configs/ItemTypes');
var PropTypes = React.PropTypes;
var cx = require('react/lib/cx');
var navigateAction = require('flux-router-component/actions/navigate');

function shorten(title){
    return title.length > 20 ? title.substring(0, 17) + '...' : title
}

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
            nodes : nodes,
            isOpened : this.props.isOpened || false
        };
    },
        configureDragDrop : function(registerType) {
        var self = this;
        registerType(ItemTypes.NODE, {
            dragSource: {
                beginDrag : function() {
                    this.setState({nodes : this.state.nodes, isDragging : true, isOpened : false});
                    return {
                        item: {
                            frontId: this.props.frontId,
                            parentDeck: this.props.parentDeck,
                            targetDeck:self
                        }
                    };
                },
                endDrag : function(){
                    self.setState({nodes : this.state.nodes, isDragging : false, isOpened: true});
                }
            },
            dropTarget: {
                over : function(item) {
                    this.props.moveNode(item, this.props.parentDeck, this.props.frontId);
                },
                acceptDrop : function(item) {
                    item.targetDeck.refs[item.frontId].setState({isDragging : false, isOpened : true});
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
        if(this.props.nodes.children && this.state.isOpened) {
            childNumber=this.props.nodes.children.length;
            
            var output = 
                this.props.nodes.children.map(function(node, index) {
                return (
                    <li><TreeNodes
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
                    /></li>
                );
            })
        }
        var nodeIcon = this.state.isOpened ? <i className="icon caret down"></i> : <i className="icon caret right"></i>;
        
        return (
                <div className="sw-tree-view">
                    <div style = {{outline : isDragging ? "dotted 1px" : "none"}}>
                    <div style ={{
                            position : "relative",
                            zIndex : 1,                            
                            opacity : isDragging ? 0 : 1
                        }}
                    >   {nodeIcon}
                        <a ref="treeNode" 
                            href={path} 
                            context={this.props.context} 
                            className={nodeClasses} 
                            onClick={this._onClick} 
                            onMouseOver={this._onMouseOver}
                            onMouseOut={this._onMouseOut} 
                        >
                          {shorten(this.props.nodes.title)}
                        </a>
                            <div  {...this.dropTargetFor(ItemTypes.NODE)} {...this.dragSourceFor(ItemTypes.NODE)} style = {{
                                        position : "absolute", 
                                        top : "0", bottom : "0", 
                                        zIndex : 1000,
                                        opacity : isDragging ? 1 : 0,
                                        width : "100%"
                            }}>
                            <a ref="treeNode" 
                                href={path} 
                                context={this.props.context} 
                                className={nodeClasses} 
                                onClick={this._onClick} 
                                onMouseOver={this._onMouseOver}
                                onMouseOut={this._onMouseOut} 
                            >
                                {shorten(this.props.nodes.title)}
                            </a>
                        </div>
                    </div></div>
                    <span ref="actionBar" className="sw-hidden">
                      <i className="small ellipsis vertical icon"></i>
                      {this.props.nodes.type=='deck'? <i className="small blue icon add link"></i> :''}
                      <i className="small teal icon edit link"></i>
                      <i className="small red icon remove link"></i>
                    </span>
                    
                    <ul>{output}</ul>
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