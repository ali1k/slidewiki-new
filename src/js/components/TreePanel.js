var React=require('react');
//SlideWiki components
var TreeView=require('./TreeView');
//stores
var TreeStore=require('../stores/TreeStore');
/**
 * Retrieve the current Tree data from the AppStore
 */
function getTreePanelState() {
  return {
    tree:{
      nodes: TreeStore.getNodes(),
      selector: TreeStore.getSelector()
    }
  };
}
var TreePanel= React.createClass({
  getInitialState: function() {
    return getTreePanelState();
  },
  componentDidMount: function() {
    TreeStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    TreeStore.removeChangeListener(this._onChange);
  },
  render: function(){
    return (
      <div className="sw-tree-panel">
        <h2> TreePanel </h2>
        <TreeView nodes={this.state.tree.nodes} selector={this.state.tree.selector}/>
      </div>
    )
  },
    /**
   * Event handler for 'change' events coming from the TreeStore
   */
  _onChange: function() {
    this.setState(getTreePanelState());
  }
})
module.exports= TreePanel;
