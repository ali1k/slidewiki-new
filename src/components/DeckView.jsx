'use strict';
var React = require('react');
//SlideWiki components


var DeckView = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="sw-deck ui segment">
            <div dangerouslySetInnerHTML={{__html: this.props.content.description}} />
          </div>
        );
    }
});

module.exports = DeckView;
