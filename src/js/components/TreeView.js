var React=require('react');
//actions
var AppTreeActions = require('../actions/AppTreeActions');

var TreeView= React.createClass({
  render: function(){
    //it has a fixed value
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
        <h4 onClick={this._onClick}> {this.props.nodes.title} </h4>
        <ul>
          {childNodes}
        </ul>
      </div>
    )
  },
  _onClick: function() {
    AppTreeActions.selectTreeNode({type: this.props.nodes.type, id: this.props.nodes.id});
  }
})
module.exports= TreeView;
