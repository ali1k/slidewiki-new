'use strict';
var React = require('react');

var About = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="container">
            <p>Here comes the description of the SlideWiki.</p>
          </div>
        );
    }
});

module.exports = About;
