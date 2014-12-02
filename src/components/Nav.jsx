'use strict';
var React = require('react');
var NavLink = require('flux-router-component').NavLink;

var Nav = React.createClass({
    getInitialState: function () {
        return {
            selected: 'home',
            links: {}
        };
    },
    render: function() {
        var selected = this.props.selected.name || this.state.selected.name,
            links = this.props.links || this.state.links,
            context = this.props.context,
            linkHTML = Object.keys(links).map(function (name) {
                var className = '',
                    link = links[name];
                if(link.group=='topnav'){
                  if (selected === name) {
                    className = 'active';
                  }
                  return (
                    <li className={className} key={link.path}>
                      <NavLink routeName={link.page} context={context}>{link.label}</NavLink>
                    </li>
                  );
                }
            });
        return (
          <nav className="navbar navbar-default navbar-static-top" role="navigation">
            <div className="container">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" routeName='home' context={context}>SlideWiki</a>
              </div>
              <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav">
                  {linkHTML}
                </ul>
              </div>
            </div>
          </nav>
        );
    }
});

module.exports = Nav;
