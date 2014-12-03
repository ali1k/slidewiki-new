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
                var className = 'item',
                    link = links[name];
                if(link.group=='topnav'){
                  if (selected === name) {
                    className += ' active';
                  }
                  return (
                    <div className={className} key={link.path}>
                      <NavLink routeName={link.page} context={context}>{link.label}</NavLink>
                    </div>
                  );
                }
            });
        return (
          <nav id="main_navbar" className="ui menu inverted navbar page grid">
            <a href="/" className="brand item">SlideWiki</a>
            {linkHTML}
          </nav>
        );
    }
});

module.exports = Nav;
