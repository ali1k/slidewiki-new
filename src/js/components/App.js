var React=require('react');
//stores
var AppTreeStore=require('../stores/AppTreeStore');
//bootstrap components
var Grid = require('react-bootstrap/Grid');
var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');
//SlideWiki components
var TreePanel=require('./TreePanel');
var ContentPanel=require('./ContentPanel');
var ContributorPanel=require('./ContributorPanel');

/**
 * Retrieve the current App data from the AppStore
 */
function getAppState() {
  return {
    nodes: AppTreeStore.getNodes(),
    deck_id: AppTreeStore.getDeckID(),
    selector: AppTreeStore.getSelector()
  };
}

var App= React.createClass({
  getInitialState: function() {
    return getAppState();
  },
  componentDidMount: function() {
    AppTreeStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    AppTreeStore.removeChangeListener(this._onChange);
  },
  render: function() {
    return (
      <Grid fluid={true}>
        <Row>
          <Col md={3}> <TreePanel /> </Col>
          <Col md={6}> <ContentPanel /> </Col>
          <Col md={3}> <ContributorPanel /> </Col>
        </Row>
      </Grid>

    );
  },
    /**
   * Event handler for 'change' events coming from the AppStore
   */
  _onChange: function() {
    this.setState(getAppState());
  },
});
module.exports= App;
