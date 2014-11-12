var React=require('react');
var cx = require('react/lib/cx');
//actions
var TreeActions = require('../actions/TreeActions');

var TreeView= React.createClass({
  //list of properties for validation
  propTypes: {
    selector: React.PropTypes.object,
    nodes: React.PropTypes.object,
  },
  render: function(){
    //it has a fixed value
    var selector=this.props.selector;
    //handling css classes
    var isSelected= (this.props.nodes.type==this.props.selector.type && this.props.nodes.id==this.props.selector.id);
    //cx is used to handle adding classes by condition
    var nodeClasses = cx({
    'sw-tree-view-node': true,
    'sw-tree-view-selected': isSelected
    });
    //handling child nodes
    var childNodes;
    if (this.props.nodes.children != null) {
      childNodes = this.props.nodes.children.map(function(node, index) {
        return <li key={index}><TreeView nodes={node} selector={selector}/></li>
      });
    }
    return (
      <div className="sw-tree-view">
        <h4 ref="treeNode" onClick={this._onClick} className={nodeClasses} onMouseOver={this._onMouseOver} onMouseOut={this._onMouseOut}> {this.props.nodes.title} </h4>
        <ul>
          {childNodes}
        </ul>
      </div>
    )
  },
  _onClick: function() {
    TreeActions.selectTreeNode({type: this.props.nodes.type, id: this.props.nodes.id});
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
})
module.exports= TreeView;
