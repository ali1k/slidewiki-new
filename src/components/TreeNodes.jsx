'use strict';
var React = require('react');
var DragDropMixin = require('react-dnd').DragDropMixin;
var ItemTypes = require('../configs/ItemTypes');
var PropTypes = React.PropTypes;
var cx = require('react/lib/cx');
var navigateAction = require('flux-router-component/actions/navigate');
var Promise = require('es6-promise').Promise;

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
        return {
            isDragging : false,
            item : this.props.item,
            isOpened : this.props.isOpened || false
        };
    },
    configureDragDrop : function(registerType) {
        var self = this;
        registerType(ItemTypes.NODE, {
            dragSource: {
                beginDrag : function() {
                    this.setState({isDragging : true, isOpened : false});
                    return {
                        item: {
                            frontId: this.props.frontId,
                            parentDeck: this.props.parentDeck,
                            targetDeck:self
                        }
                    };
                },
                endDrag : function(){
                    self.setState({isDragging : false, isOpened : false})
                }
            },
            dropTarget: {
                over : function(item) {
                    if (this.props.frontId !== item.frontId){
                        if (this.state.item.type === "deck"){                            
                            var frontId = item.frontId;
                            var targetDeck = self;
                            var parentDeck = item.parentDeck;
                            var parentState = item.parentDeck.state;
                            var targetState = this.state;
                            this.state.isOpened = true;
                            //search a moving node
                            var node = parentState.item.children.filter(function(i){return i.frontId===frontId})[0];  
                            var nodeIndex = parentState.item.children.indexOf(node);
                            //remove moving node
                            item.targetDeck = self; 
                            item.parentDeck = self;
                            parentState.item.children.splice(nodeIndex, 1);
                            //unshift moving node to a new place
                            this.state.item.children.unshift(node);
                            parentDeck.setState({item : parentState.item});
                            //set moving state for opacity
                            if(this.refs[item.frontId]){
                                this.setState({isOpened : true});
                                this.refs[item.frontId].setState({isDragging : true, isOpened : false});
                            }
                        }else{
                            this.props.moveNode(item, this.props.parentDeck, this.props.frontId);
                        }
                    }
                },
                acceptDrop : function(item) {
                    if (item){
                        item.targetDeck.refs[item.frontId].setState({isDragging : false, isOpened : false});
                    }
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
        var isSelected= (this.props.item.type==this.props.selector.type && this.props.item.id==this.props.selector.id);

        //cx is used to handle adding classes by condition
        var nodeClasses = cx({
            'sw-tree-view-node': true,
            'sw-tree-view-selected': isSelected,
            'sw-tree-view-deck': this.props.item.type=='deck',
            'sw-tree-view-slide': this.props.item.type=='slide'
        });
        var path=this._getPath();
        var self = this;
        //handling child nodes
        var childNodes, childNumber = 0;
        if(this.state.item.children && this.state.isOpened) {
            childNumber=this.props.item.children.length;
            
            var output = 
                this.props.item.children.map(function(node, index) {
                return (
                    <li><TreeNodes
                        moveNode = {self.props.moveNode}
                        item = {node}
                        key={node.type + node.id}
                        frontId={node.type + node.id}
                        selector={self.props.selector}
                        context={self.props.context} 
                        rootID={self.props.rootID}
                        parentDeck={self}
                        className={index==(childNumber-1)?'last-child':''}
                        ref = {node.type + node.id}
                    /></li>
                );
            })
        }
        var nodeIcon = this.state.item.type==="deck" && this.state.isOpened ? <i className="icon caret down"></i> : <i className="icon caret right"></i>;
        
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
                          {shorten(this.props.item.title)}
                        </a>
                            <div  {...this.dragSourceFor(ItemTypes.NODE)} {...this.dropTargetFor(ItemTypes.NODE)}  style = {{
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
                                {shorten(this.props.item.title)}
                            </a>
                        </div>
                    </div></div>
                    <span ref="actionBar" className="sw-hidden">
                      <i className="small ellipsis vertical icon"></i>
                      {this.props.item.type=='deck'? <i className="small blue icon add link"></i> :''}
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
        return '/deck/'+this.props.rootID+'/'+this.props.item.type + '/' + this.props.item.id;
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