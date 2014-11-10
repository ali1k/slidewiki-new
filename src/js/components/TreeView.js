var React=require('react');
var TreeView= React.createClass({
  render: function(){
    var selector=this.props.selector;
    var childNodes;
    var selectedClass='';
    if (this.props.nodes.children != null) {
      childNodes = this.props.nodes.children.map(function(node, index) {
        if(node.type==selector.type && node.id==selector.id){
          selectedClass="sw-tree-view-selected ";
        }else{
          selectedClass="";
        }
        return <li className={selectedClass} key={index}><TreeView nodes={node} selector={selector}/></li>
      });
    }
    return (
      <div className="sw-tree-view">
        <h3> {this.props.nodes.title} </h3>
        <ul>
          {childNodes}
        </ul>
      </div>
    )
  }
})
module.exports= TreeView;
