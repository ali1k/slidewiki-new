'use strict';
var React = require('react');

var ContributorsView = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        var list;
        list = this.props.contributors.map(function(node, index) {
          return <li key={index}>{node.name}</li>
        });

        return (
          <div className="sw-contributors">
          <h3> Contributors </h3>
          <h4> {list} </h4>
          </div>
        );
    }
});

module.exports = ContributorsView;
