'use strict';
var React = require('react');
var ItemTypes = require('../configs/ItemTypes');
var cx = require('react/lib/cx');
var navigateAction = require('flux-router-component/actions/navigate');
var treeActions = require('../actions/TreeActions');

function shorten(title){
    return title.length > 20 ? title.substring(0, 17) + '...' : title
}

var TreeNodes = React.createClass({
    
    render : function() {      
        var self = this;
        //it has a fixed value
        var selector=this.props.selector;
        var context=this.props.context;
        var rootID=this.props.rootID;
        
        //handling css classes
        var isSelected= (this.props.item.type==this.props.selector.type && this.props.item.id==this.props.selector.id);
        var isDragging;
        if (this.props.dragging) {
            isDragging = (this.props.item.type==this.props.dragging.type && this.props.item.id==this.props.dragging.id);
        } else {
            isDragging = false;
        };
        var isDraggable= (!(this.props.item.type=="deck" && this.props.item.id==this.props.rootID));

        //cx is used to handle adding classes by condition
        var nodeClasses = cx({
            'sw-tree-view-node': true,
            'sw-tree-view-selected': isSelected,
            'sw-tree-view-deck': this.props.item.type=='deck',
            'sw-tree-view-slide': this.props.item.type=='slide'
        });
        var path=this._getPath();

        //handling child nodes
        var childNodes, childNumber = 0;
        if(this.props.item.children) {
            childNumber=this.props.item.children.length;            
            var output = 
                this.props.item.children.map(function(node, index) {
                return (
                   <li key={node.type + node.id}>
                    <TreeNodes
                        item = {node}
                        position={index + 1}
                        f_index={node.f_index}
                        parentID={self.props.item.id}
                        rootID={self.props.rootID}
                        ref={node.type + node.id}
                        selector={self.props.selector}
                        dragging={self.props.dragging}
                        allowDrop={self.props.allowDrop}
                        context={self.props.context} 
                        className={index==(childNumber-1)?'last-child':''}

                    /></li>
                );
            })
        }
        //var nodeIcon = this.props.item.type==="deck" && this.state.isOpened ? <i className="icon caret down"></i> : <i className="icon caret right"></i>;
        
        return (
                <div className="sw-tree-view">
                    <div draggable = {isDraggable} onDragOver={this._onDragOver} onDragEnter={this._onDragEnter} onDragStart = {this._onDragStart} onDrag = {this._onDrag} onDragEnd = {this._onDragEnd} onDrop = {this._onDrop}>
                        
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
                       
                        <span ref="actionBar" className="sw-hidden">
                          <i className="small ellipsis vertical icon"></i>
                          {this.props.item.type=='deck'? <i className="small blue icon add link"></i> :''}
                          <i className="small teal icon edit link"></i>
                          <i className="small red icon remove link"></i>
                        </span>
                    </div>
                    <ul>{output}</ul>
                </div>
        );
    },
    _onClick: function(e) {
        
        this.props.context.executeAction(navigateAction, {type: 'click', url: this._getPath()});
        e.preventDefault();
    },
    _onDragEnter : function(e) {
        var dropCandidate = {parentID : this.props.item.parentID, type: this.props.item.type, position : this.props.position, ref : this.props.ref, f_index : this.props.f_index};
        this.props.context.executeAction(treeActions.checkDropPossible, dropCandidate);
    },
    _onDragOver: function(e){
        if (this.props.allowDrop){
            e.preventDefault();
        }
    },
    _onDragStart : function(e) {
        var draggingItem = {f_index : this.props.item.f_index, type : this.props.item.type};
        this.props.context.executeAction(treeActions._onDragStart, draggingItem);
    },
    _onDragEnd : function(e) {
        //e.dataTransfer.setData("Text", e.target.id);
        //e.preventDefault();
    },
    _onDrop : function(e) {
        var data = event.dataTransfer.getData("Text");
        //e.dataTransfer.setData("Text", e.target.id);
        //e.preventDefault();
    },
          
    _getPath: function() {
        return '/deck/'+this.props.rootID+'/'+this.props.item.type + '/' + this.props.item.id;
    },
    //ToDo: add states for onMouseOver and onMouseOut events if needed
    _onMouseOver: function(e) {
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