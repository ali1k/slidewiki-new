var React=require('react');
var TreeView=require('./TreeView');

var TreePanel= React.createClass({
  render: function(){
    return (
      <div className="sw-tree-panel">
        <h2> TreePanel </h2>
        <TreeView nodes={this.props.tree.nodes} selector={this.props.tree.selector}/>
      </div>
    )
  }
})
module.exports= TreePanel;
