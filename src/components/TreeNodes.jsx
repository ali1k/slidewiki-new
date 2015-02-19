'use strict';
var React = require('react');
var ItemTypes = require('../configs/ItemTypes');
var cx = require('react/lib/cx');
var navigateAction = require('flux-router-component/actions/navigate');
var treeActions = require('../actions/TreeActions');
var deckActions = require('../actions/DeckActions');

function shorten(title){
    return title.length > 20 ? title.substring(0, 17) + '...' : title;
}

var TreeNodes = React.createClass({
    getInitialState: function(){
        return {
            isOpened : this.props.isOpened || false,
            isOvered : false,
            item: this.props.item
        }
    },
    switchOpened : function(){
        var newState = this.state.isOpened;
        this.setState({isOpened : !newState});
    },
    
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
        var isOvered = this.state.isOvered;
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
                this.state.item.children.map(function(node, index) {                  
               return (
                   <li key={node.f_index} style = {{display: self.state.isOpened ? 'block' : 'none'}}>
                    <TreeNodes
                        item = {node}
                        position={index + 1}
                        parentID={self.state.item.id}
                        parent = {self}
                        parentRef={self.props.ref}
                        rootID={self.props.rootID}
                        ref={node.f_index}
                        selector={self.props.selector}
                        dragging={self.props.dragging}
                        allowDrop={self.props.allowDrop}
                        context={self.props.context} 
                        className={index==(childNumber-1)?'last-child':''}
                        moveItem = {self.props.moveItem}
                    /></li>
                );
            })
        };
        var nodeIcon;
                if (this.props.item.type==="deck"){
                    nodeIcon = this.state.isOpened ? <i className="icon caret down" onClick={self.switchOpened}></i> : <i className="icon caret right" onClick={self.switchOpened}></i>;
                }
        
        return (
                
                <div className="sw-tree-view">
                    <div style = {{outline : isDragging ? "dotted 1px" : "none"}}>
                        <div ref="forTransparency" style ={{
                            position : "relative",
                            zIndex : 1,                            
                            opacity : isDragging ? 0 : 1
                        }} 
                        >   
                          
                            <a ref="treeNodeVisible" 
                                href={path} 
                                context={this.props.context} 
                                className={nodeClasses} 
                                onClick={this._onClick} 
                                onMouseOver={this._onMouseOver}
                                onMouseOut={this._onMouseOut} 
                                onDrop = {this.props._onDrop}
                                
                            >
                            {nodeIcon}{shorten(this.props.item.title)}
                            </a>
                            <div style={{width:"100%", height:'3px', backgroundColor: 'blue', display : isOvered ? 'block' : 'none'}}></div>
                            <div draggable = {isDraggable}
                                onDragEnter={this._onDragEnter} 
                                onDragStart = {this._onDragStart}
                                onDragEnd = {this._onDragEnd}
                                onDragOver = {this._onDragOver}
                                onDrop = {this._onDrop}
                                onDragLeave={this._onDragLeave}
                                style = {{
                                        position : "absolute", 
                                        top : "0", bottom : "0", 
                                        zIndex : 1000,
                                        opacity : isDragging ? 1 : 0,
                                        width : "100%"
                                }}>
                            >

                                <a ref="treeNodeTrue" 
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
                        </div>
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
        this.props.context.executeAction(treeActions._updateSelector, {selector: {type: this.props.item.type, id: this.props.item.id}, mode: 'view'});
        this.props.context.executeAction(deckActions.loadContainer, {selector: {type: this.props.item.type, id: this.props.item.id}, mode: 'view'} );
        this.props.context.executeAction(deckActions.loadContributors, {selector: {type: this.props.item.type, id: this.props.item.id}, mode: 'view'} );
        e.preventDefault();
    },
    _onDragStart : function(e) {
        e.stopPropagation();        
        var draggingItem = this;
        this.setState({isOpened : false});
        this.props.context.executeAction(treeActions._onDragStart, draggingItem);
        
    },
    _onDragEnter: function(e){
        
        if (this.props.dragging.state.item.type !== this.props.item.type || this.props.dragging.state.item.id !== this.props.item.id)  {
            e.preventDefault(); // Necessary. Allows us to drop.
            e.stopPropagation();
            window.event.returnValue=false; 
            if (this.props.item.type == 'deck'){
                this.setState({isOpened : true, isOvered : true});
            }else{
                this.setState({isOvered : true});
            }
            var dropCandidate = {props: this.props, state: this.state};
            var self = this;
            this.props.context.executeAction(treeActions.checkDropPossible, dropCandidate);
        }
    },
    _onDragLeave: function(e){
        
        this.setState({ 'isOvered' : false});
    },        
    _onDragOver: function(e){
        e.preventDefault(); // Necessary. Allows us to drop.
        e.stopPropagation();
        window.event.returnValue=false;
    },
    _onDrop : function(e) {
        e.preventDefault();
        e.stopPropagation()
        var dropPlace= {id : this.props.item.id, type: this.props.item.type, position : this.props.position, parentID: this.props.parentID, ref : this.props.ref, f_index : this.props.item.f_index};
        this.setState({'isOpened' : true, 'isOvered' : false});
        if (this.props.allowDrop){
            this.props.moveItem(this);
            //this.props.context.executeAction(treeActions._onDrop, this);
        }
    }, 
    
    _getPath: function() {
        return '/deck/'+this.props.rootID+'/'+this.props.item.type + '/' + this.props.item.id;
    },
    //ToDo: add states for onMouseOver and onMouseOut events if needed
    _onMouseOver: function(e) {
        var current = this.refs.treeNodeVisible.getDOMNode();
        current.className += " sw-tree-view-over"
        var actionBar = this.refs.actionBar.getDOMNode();
        actionBar.className ="";
    },
    _onMouseOut: function(e) {
        var current = this.refs.treeNodeVisible.getDOMNode();
        var re = / sw-tree-view-over/gi;
        var newClasses=current.className.replace(re, "");
        current.className=newClasses
        var actionBar = this.refs.actionBar.getDOMNode();
        actionBar.className ="sw-hidden";
    }
});


module.exports = TreeNodes;