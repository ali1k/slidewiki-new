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
          <div>
          <nav id="main_navbar" className="ui menu inverted navbar page grid">
            <a href="/" className="brand item">SlideWiki</a>
            {linkHTML}
            <UserMenu context={context} />
          </nav>
        </div> 
        );
    }
});





var UserMenu = React.createClass({
    displayName: 'UserMenu',
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
        
      var state = this.getStore(AuthStore).getState();
      return state;
         
    },

    _onChange: function() {
        var state = this.getStateFromStores();        
        this.setState(state);
    }, 
    
    
    render : function(){
        var self = this;
        var menu;
        if (this.state.isLoggedIn){
            menu = <DropdownB context = {this.props.context} user = {this.state.currentUser} />;
        }else{
            menu = <LoginButton context = {this.props.context} />;
        }
        return (
            <div className="item">{menu}</div>
        )
    }
});

var Dropdown = React.createClass({
    getInitialState: function () {
        return {
            isOpened : false
        }        
    },
    _handleLogout : function(e){
        this.props.context.executeAction(loginActions.logOut);
    },
    _openMenu: function(e){
        this.setState({isOpened: true});
    },
    render : function(){
        var self  = this;
        var visibility = this.state.isOpened ? "visible" : "hidden";
        var visibilityMenu = "ui inverted " + visibility;
    return (
        <div className="ui inverted" onClick={self._openMenu}>                        
            {this.props.user.username}<i className="dropdown icon"></i>
            <div className={visibilityMenu}>
                <div onClick={self._handleLogout}><i>className="sign out icon"</i>Logout</div>
            </div>
        </div>
    )}
});

var DropdownB = React.createClass({
    _handleLogout : function(e){
        this.props.context.executeAction(loginActions.logOut);
    },
    render : function(){
        var self  = this;
        var style = {"z-index" : "1000 !important"};
    return (
        <div className="ui dropdown simple inverted" style={style}>                        
            {this.props.user.username}<i className="dropdown icon"></i>
            <div className="menu ui inverted" style={style}>
                <div className = "item"><a onClick={self._handleLogout}>Logout</a></div>
            </div>
        </div>
    )}
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
       
        var login = this.state.isLoggedIn ? null : <a style={style} onClick={self._handleOpenForm} > Login </a>
        
        return (
            <div>
                {login}
            </div>
        )
    }

});

module.exports = Nav;