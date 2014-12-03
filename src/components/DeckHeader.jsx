'use strict';
var React = require('react');

var DeckHeader = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="ui menu sw-deck-header">
            <a className="active item">
             DeckHeader
            </a>
            <div className="right menu">
              <div className="item">
                <div className="ui transparent icon input">
                  <input type="text" placeholder="Search..." />
                  <i className="search link icon"></i>
                </div>
              </div>
            </div>
          </div>
        );
    }
});

module.exports = DeckHeader;
