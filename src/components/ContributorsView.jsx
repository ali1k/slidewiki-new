'use strict';
var React = require('react');

var ContributorsView = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        var list;
        list = this.props.contributors.map(function(node, index) {
          return <li key={index}><a href={"/user/"+ node.id}>{node.username}</a> </li>
        });

        return (
          <div className="sw-contributors">
            <div className="panel">
              <div className="ui secondary top red attached segment">
                Contributors
              </div>
              <div className="ui bottom attached segment">
                {list}
              </div>
            </div>
          </div>
        );
    }
});

module.exports = ContributorsView;
