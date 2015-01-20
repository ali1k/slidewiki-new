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
    },
    componentDidUpdate: function(prevProps, prevState) {
      //do actions after slide is shown -> post processing actions
      //render MathJax Content
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }
});

module.exports = SlideView;
