'use strict';
var React = require('react');

var LoginPage = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="ui page grid">
            <div className="row">
              <div className="column">
                <h2 className="ui header">Login/Register</h2>
                <p>Here comes the login/register form.</p>
              </div>
            </div>
          </div>
        );
    }
});

module.exports = LoginPage;
