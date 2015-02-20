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
            item: this.props.item,
            titleInput : false

        }
    },
    switchOpened : function(){
        var newState = this.state.isOpened;
        this.setState({isOpened : !newState});
    },
    handleChange: function(event) {
        this.setState({value: event.target.value});
    },
    render : function() {      
        var self = this;
        //it has a fixed value
        var selector=this.props.selector;
        var context=this.props.context;
        var rootID=this.props.rootID;
        
        //handling css classes
        var isSelected= (this.props.item.type==this.props.selector.type && this.props.item.id==this.props.selector.id && this.props.item.f_index == this.props.selected.f_index);
        var isDragging;
        if (this.props.dragging) {
            isDragging = (this.props.item.type==this.props.dragging.type && this.props.item.id==this.props.dragging.id);
        } else {
            isDragging = false;
        };
        var isDraggable= (!(this.props.item.type=="deck" && this.props.item.id==this.props.rootID));
        var isOvered = this.state.isOvered;
        var title = this.state.titleInput;
        //cx is used to handle adding classes by condition
        var nodeClasses = cx({
            'sw-tree-view-node': true,
            'sw-tree-view-selected': isSelected,
            'ui header item mini green inverted': this.props.item.type=='deck',
            'ui mini item ': this.props.item.type=='slide'
        });
        var path=this._getPath();
        
       
        //handling child nodes
        var childNodes, childNumber = 0;
        if(this.props.item.children) {
            childNumber=this.props.item.children.length; 
             
            var output = 
                this.state.item.children.map(function(node, index) {                  
               return (
                   <div className="ui item mini" key={node.f_index} style = {{display: self.state.isOpened ? 'block' : 'none'}}>
                    <TreeNodes
                        item = {node}
                        position={index + 1}
                        parentID={self.state.item.id}
                        parent = {self}
                        parentRef={self.props.ref}
                        rootID={self.props.rootID}
                        ref={node.f_index}
                        selector={self.props.selector}
                        selected={self.props.selected}
                        dragging={self.props.dragging}
                        allowDrop={self.props.allowDrop}
                        context={self.props.context} 
                        className={index==(childNumber-1)?'last-child':''}
                        moveItem = {self.props.moveItem}
                    /></div>
                );
            })
        };
        var nodeIcon;
                if (this.props.item.type==="deck"){
                    nodeIcon = this.state.isOpened ? <i className="icon caret down" onClick={self.switchOpened}></i> : <i className="icon caret right" onClick={self.switchOpened}></i>;
                }

        return (
                
                <div className="ui menu mini icon fluid">
                        <div className={nodeClasses}
                            draggable={isDraggable}
                            onDragEnter={this._onDragEnter} 
                            onDragStart = {this._onDragStart}
                            onDragEnd = {this._onDragEnd}
                            onDragOver = {this._onDragOver}
                            onDrop = {this._onDrop}
                            onDragLeave={this._onDragLeave}
                            style={{display: this.state.titleInput ? "none" : "block"}}
                            onMouseOver={this._onMouseOver}
                            onMouseOut={this._onMouseOut}
                            ref="treeNode" 
                            href={path} 
                            context={this.props.context} 
                            
                            onClick={this._onClick} 
                        >
                           <span> {nodeIcon}{shorten(this.props.item.title)}</span>
                            <span ref="actionBar" className="sw-hidden">
                                <i className="small ellipsis vertical icon"></i>
                                {this.props.item.type=='deck'? <i className="small blue icon add link"></i> :''}
                                <i className="small teal icon edit link" onClick={this.showTitleInput}></i>
                                <i className="small red icon remove link"></i>
                            </span>
                        </div>
                        
                    
                    <div style={{width:"100%", height:'3px', backgroundColor: 'blue', display : isOvered ? 'block' : 'none'}}></div>
                    <div className="ui minilabeled input active" style={{display: this.state.titleInput ? "block" : "none"}}>
                        <input type="text" placeholder={this.props.item.title} />
                    </div> 
                    <div >{output}</div>
                </div>
        );
    },
    showTitleInput: function(e){
        this.setState({titleInput : true})
    },
    _onClick: function(e) {
        this.props.context.executeAction(treeActions._updateSelector, {
            selector: {
                title:this.state.item.title,
                type: this.state.item.type, 
                id: this.state.item.id, 
                parent: this.props.parent
            }, 
            mode: 'view',
            selected : this.state.item
        });
        this.props.context.executeAction(deckActions.loadContainer, {selector: {type: this.props.item.type, id: this.props.item.id}, mode: 'view'} );
        this.props.context.executeAction(deckActions.loadContributors, {selector: {type: this.props.item.type, id: this.props.item.id}, mode: 'view'} );
        e.preventDefault();
    },
    _onDragStart : function(e) {
        if (this.state.item.id !== this.props.rootID){
            e.stopPropagation();        
            var draggingItem = this;
            this.setState({isOpened : false});
            this.props.context.executeAction(treeActions._onDragStart, draggingItem);
        }else{
            e.preventDefault();
        }
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
        if (this.props.allowDrop && this.props.dragging.state.item.type !== this.props.item.type || this.props.dragging.state.item.id !== this.props.item.id){
            e.preventDefault();
            e.stopPropagation();
            this.setState({'isOpened' : true, 'isOvered' : false});
            if (this.props.allowDrop){
                this.props.moveItem(this);
            }
        }
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

