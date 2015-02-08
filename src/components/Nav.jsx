'use strict';
var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var AuthStore = require('../stores/AuthStore');
var StoreMixin = require('fluxible').Mixin;
var loginActions = require('../actions/LoginActions');
var LocalStorageMixin = require('react-localstorage');

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
                      <NavLink routeName={link.page} context={context} href={link.path}>{link.label}</NavLink>
                    </div>
                  );
                }
            });
            
        return (
          <nav id="main_navbar" className="ui menu inverted navbar page grid">
            <a href="/" className="brand item">SlideWiki</a>
            {linkHTML}
            <LoginButton context={context}/>
            <UserIcon context={context }/>
           
          </nav>
        );
    }
});





var UserIcon = React.createClass({
    displayName: 'UserIcon',
    mixins: [StoreMixin, LocalStorageMixin],
    statics: {
      storeListeners: {
        _onChange: [AuthStore]
      }
    },
    getInitialState: function () {
        
        var state = this.getStateFromStores();
        return state;
    },
    getStateFromStores: function () { 
        
      return this.getStore(AuthStore).getState()
         
    },

    _onChange: function() {
        var state = this.getStateFromStores();
        console.log('userIcon_OnChange:' + this.getStore(AuthStore).getIsLoggedIn()); 
        this.setState(state);
    }, 
    _handleLogout : function(e){
        console.log('logout');
    },
    render : function(){
        var self = this;
        var style = {cursor : 'pointer'};
        var logout = <a style={style} onClick={self._handleLogout} > Logout </a>
        var username = this.state.isLoggedIn ? this.state.currentUser.username : null;
        return (
            <div className="item">{username}</div>
        )
    }
});

var LoginButton = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [AuthStore]
      }
    },
    getInitialState: function () {
        var state = this.getStateFromStores();
        return state;
    },
    getStateFromStores: function () {        
      return {
          isLoggedIn: this.getStore(AuthStore).getIsLoggedIn(),
          isLoginFormOpened: this.getStore(AuthStore).getIsLoginFormOpened(),
          isLoggingIn: this.getStore(AuthStore).getIsLoggingIn(),
          currentUser: this.getStore(AuthStore).getCurrentUser(),
      };
    },

    _onChange: function() {
        var state = this.getStateFromStores();
        this.setState(state);
    },    
   
    _handleOpenForm: function(e){
        e.preventDefault();
        
        this.props.context.executeAction(loginActions.openForm, {});
        
    },
    render : function(){
        var self = this;
        var style = {cursor : 'pointer'};
        return (
            <div className='item'>
                <a style={style} onClick={self._handleOpenForm} > Login -> </a>
            </div>
        )
    }

});

module.exports = Nav;