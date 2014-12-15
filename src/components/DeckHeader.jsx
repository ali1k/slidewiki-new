'use strict';
var React = require('react');
//SlideWiki components
var Breadcrumb=require('./Breadcrumb.jsx');
//Actions
var navigateAction = require('flux-router-component/actions/navigate');

var DeckHeader = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="ui menu sw-deck-header">
            <div className="item">
              <Breadcrumb context={this.props.context} />
            </div>
          </div>
        );
    }
});

module.exports = DeckHeader;
