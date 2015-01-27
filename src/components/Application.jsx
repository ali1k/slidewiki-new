'use strict';
var React = require('react');
var Nav = require('./Nav.jsx');
var Footer = require('./Footer.jsx');
var HomePage = require('./HomePage.jsx');
var AboutPage = require('./AboutPage.jsx');
var DeckPage = require('./DeckPage.jsx');
var LoginPage = require('./LoginPage.jsx');
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
console.log('====================================================================');
console.log(this.state.route.name);
      //choose the right page based on the route
      switch(this.state.route.name){
        case 'home':
          output=<HomePage/>
          break;
        case 'about':
          output=<AboutPage/>
          break;
        case 'deck':
          output=<DeckPage context={this.props.context} deckParams={this.state.route.params} />
          break;
        case 'login':
            output=<LoginPage/>
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
    },
    componentDidUpdate: function(prevProps, prevState) {
      var newState = this.state;
      if (newState.pageTitle === prevState.pageTitle) {
        return;
      }
      document.title = newState.pageTitle;
    }
});

module.exports = Application;
