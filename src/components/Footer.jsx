'use strict';
var React = require('react');

var Footer = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="ui page grid">
            <div className="row">
              <div className="column">
                <div className="ui divider"></div>
                <span>&copy; SlideWiki 2014</span>
              </div>
            </div>
          </div>
        );
    }
});

module.exports = Footer;
