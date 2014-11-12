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
