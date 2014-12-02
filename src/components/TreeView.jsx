'use strict';
var React = require('react');
var cx = require('react/lib/cx');
var navigateAction = require('flux-router-component/actions/navigate');
var TreeView = React.createClass({
  //list of properties for validation
  propTypes: {
    selector: React.PropTypes.object,
    nodes: React.PropTypes.object,
  },
  render: function() {
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
    //handling child nodes
    var childNodes, childNumber=0;
    if (this.props.nodes.children != null) {
      childNumber=this.props.nodes.children.length;
      childNodes = this.props.nodes.children.map(function(node, index) {
        return <li key={index} className={index==(childNumber-1)?'last-child':''}>
                  <TreeView nodes={node} selector={selector} context={context} rootID={rootID} />
               </li>
      });
    }

    return (
      <div className="sw-tree-view">
      <span ref="treeNode" context={this.props.context} className={nodeClasses} onClick={this._onClick} onMouseOver={this._onMouseOver} onMouseOut={this._onMouseOut}>
        {this.props.nodes.title}
      </span>
      {childNumber? <ul>{childNodes}</ul>:''}
      </div>
    );
  },
  _onClick: function() {
    var path='/deck/'+this.props.rootID+'/'+this.props.nodes.type + '/' + this.props.nodes.id;
    this.props.context.executeAction(navigateAction, {path: path});
  },
  //ToDo: add states for onMouseOver and onMouseOut events if needed
  _onMouseOver: function() {
    var current = this.refs.treeNode.getDOMNode();
    current.className += " sw-tree-view-over"
  },
  _onMouseOut: function() {
    var current = this.refs.treeNode.getDOMNode();
    var re = / sw-tree-view-over/gi;
    var newClasses=current.className.replace(re, "");
    current.className=newClasses
  }
});

module.exports = TreeView;
