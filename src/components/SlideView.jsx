'use strict';
var React = require('react');
//stores

var SlideView = React.createClass({
    render: function() {

        return (
          <div className="sw-slide">
            <div className="ui segment">
              <h3> Slide {this.props.id} </h3>
              <h4 dangerouslySetInnerHTML={{__html: this.props.content.body}} />
            </div>
          </div>
        );
    }
});

module.exports = SlideView;
