'use strict';
var React = require('react');
var Nav = require('./Nav.jsx');
var Footer = require('./Footer.jsx');
var Home = require('./Home.jsx');
var About = require('./About.jsx');
var Deck = require('./Deck.jsx');
var ApplicationStore = require('../stores/ApplicationStore');
var RouterMixin = require('flux-router-component').RouterMixin;
var StoreMixin = require('fluxible-app').StoreMixin;

var Application = React.createClass({
    mixins: [RouterMixin, StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [ApplicationStore]
      }
    },
    getInitialState: function () {
        return this.getStore(ApplicationStore).getState();
    },
    _onChange: function () {
        var state = this.getStore(ApplicationStore).getState();
        this.setState(state);
    },
    render: function () {
      var output='';
      //choose the right page based on the route
      switch(this.state.route.name){
        case 'home':
          output=<Home/>
          break;
        case 'about':
          output=<About/>
          break;
        case 'deck':
          output=<Deck context={this.props.context} deckParams={this.state.route.params} />
          break;
      }
      //render content
        return (
            <div>
                  <Nav selected={this.state.route} links={this.state.routes} context={this.props.context} />
                      {output}
                  <Footer />
            </div>
        );
    }
});

module.exports = Application;
