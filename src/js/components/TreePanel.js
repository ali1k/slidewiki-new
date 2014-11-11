var React=require('react');
var TreeView=require('./TreeView');
//stores
var AppTreeStore=require('../stores/AppTreeStore');
/**
 * Retrieve the current Tree data from the AppStore
 */
function getTreePanelState() {
  return {
    tree:{
      nodes: AppTreeStore.getNodes(),
      selector: AppTreeStore.getSelector()
    }
  };
}
var TreePanel= React.createClass({
  getInitialState: function() {
    return getTreePanelState();
  },
  componentDidMount: function() {
    AppTreeStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    AppTreeStore.removeChangeListener(this._onChange);
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
   * Event handler for 'change' events coming from the AppTreeStore
   */
  _onChange: function() {
    this.setState(getTreePanelState());
  }
})
module.exports= TreePanel;
