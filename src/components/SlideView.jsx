'use strict';
var React = require('react');

var SlideView = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="sw-slide ui segment secondary">
          <h3> Slide {this.props.id} </h3>
          <h4> {this.props.content.body} </h4>
          </div>
        );
    }
});

module.exports = SlideView;
