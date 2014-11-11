var React=require('react');
//actions
var TreeActions = require('../actions/TreeActions');

var TreeView= React.createClass({
  render: function(){
    //it has a fixed value
    var selector=this.props.selector;
    //handling css classes
    var isSelected= (this.props.nodes.type==this.props.selector.type && this.props.nodes.id==this.props.selector.id);
    var nodeClasses="sw-tree-view-node";
    if(isSelected){
      nodeClasses += " sw-tree-view-selected";
    }
    //handling child nodes
    var childNodes;
    if (this.props.nodes.children != null) {
      childNodes = this.props.nodes.children.map(function(node, index) {
        return <li key={index}><TreeView nodes={node} selector={selector}/></li>
      });
    }
    return (
      <div className="sw-tree-view">
        <h4 onClick={this._onClick} className={nodeClasses}> {this.props.nodes.title} </h4>
        <ul>
          {childNodes}
        </ul>
      </div>
    )
  },
  _onClick: function() {
    TreeActions.selectTreeNode({type: this.props.nodes.type, id: this.props.nodes.id});
  }
})
module.exports= TreeView;
