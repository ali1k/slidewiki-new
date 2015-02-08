'use strict';
var React = require('react');
var Nav = require('./Nav.jsx');
var Footer = require('./Footer.jsx');
var HomePage = require('./HomePage.jsx');
var AboutPage = require('./AboutPage.jsx');
var DeckPage = require('./DeckPage.jsx');
var LoginPage = require('./LoginPage.jsx');
var ApplicationStore = require('../stores/ApplicationStore');
var AuthStore = require('../stores/AuthStore');
var RouterMixin = require('flux-router-component').RouterMixin;
var StoreMixin = require('fluxible').Mixin;

var Application = React.createClass({
    mixins: [RouterMixin, StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [ApplicationStore, AuthStore]
      }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    getStateFromStores: function () {
        var appState = this.getStore(ApplicationStore).getState();
        appState.isLoginFormOpened = this.getStore(AuthStore).getIsLoginFormOpened();
        return appState;
    },
    _onChange: function () {
        
        this.setState(this.getStateFromStores());
    },
    render: function () {
      var output='';
      var loginDiv;

      
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
          
      };
        if (this.state.isLoginFormOpened){ 
            loginDiv = <LoginPage context={this.props.context}/>
        }else{
            loginDiv = ''
        }     
      //render content
        return (
            <div>
                  <div><Nav selected={this.state.route} links={this.state.routes} context={this.props.context} /></div>
                        {loginDiv}
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
