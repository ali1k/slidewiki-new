'use strict';
var React = require('react');
//stores

var SlideView = React.createClass({
    render: function() {

        return (
          <div className="sw-slide" id="sw_slide">
            <div className="ui segment">
              <h3> {this.props.content.title} </h3>
              <h4 dangerouslySetInnerHTML={{__html: this.props.content.body}} />
            </div>
          </div>
        );
    }
});

module.exports = SlideView;
