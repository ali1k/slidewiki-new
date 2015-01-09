'use strict';
var React = require('react');
//stores

var SlideView = React.createClass({
    render: function() {

        return (
          <div className="sw-slide" id="sw_slide">
            <div className="ui segment">
              <div dangerouslySetInnerHTML={{__html: this.props.content.body}} />
            </div>
          </div>
        );
    }
});

module.exports = SlideView;
