'use strict';
var React = require('react');
//SlideWiki components

var DeckView = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="sw-deck ui segment secondary">
            <h3> {this.props.content.title} </h3>
            <h4 dangerouslySetInnerHTML={{__html: this.props.content.description}} />
          </div>
        );
    }
});

module.exports = DeckView;
