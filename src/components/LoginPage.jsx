'use strict'
var React = require('react');
var debug = require('debug');
//stores
var AuthStore = require('../stores/AuthStore');
var StoreMixin = require('fluxible').Mixin;
var loginActions = require('../actions/LoginActions');



var LoginPage = React.createClass({
    
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
        var state = this.getStore(AuthStore).getState();

        return state;         
    },
    _onChange: function () {
        
        this.setState(this.getStateFromStores());
    },
   
    
   
    render: function() {
        var self = this;
        var loaderClass = "ui blue submit button";
        if (this.state.isLoggingIn){
            loaderClass = "ui blue submit button loading";
        }
        return (
            <div className="html ui six wide segment">
                <div className="ui two column middle aligned relaxed fitted centered stackable grid ">
                    <div className="column four wide"><LoginForm context={this.props.context} isLoggingIn={self.state.isLoggingIn} /></div>
                    <div className="ui vertical divider ">
                      Or
                    </div>
                    <div className="center aligned column four wide"><SignForm context={this.props.context} isLoggingIn={self.state.isLoggingIn} /></div>
                </div>
            </div>    
        )
    },
});



var LoginForm = React.createClass({
    
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
        return this.getStore(AuthStore).getState();         
    },
    _onChange: function () {
        
        this.setState(this.getStateFromStores());
    },
    _openLoginForm: function(e) {
        this.props.context.executeAction(loginActions.showLoginForm);
    },
    _handleSubmit: function(e) {
        
        var username = this.refs.username.getDOMNode().value.trim();
        var password = this.refs.password.getDOMNode().value.trim(); 
        this.props.context.executeAction(loginActions.sendLogin, {username : username, password: password});
    },
    render : function(){
        var userInputClass = "ui left icon input";
        var passInputClass = "ui left icon input";
        var loaderClass = "ui blue submit button";
        if (this.state.error){
            if (this.state.error.loginError){
                userInputClass += ' error';
            }
            if (this.state.error.passError){
                passInputClass += ' error';
            }
        }
        var outputLogin;
        var self = this;
        if (this.state.showLoginForm){
            outputLogin = <div className="ui form segment">
                            <div className="field">
                                <label>Username</label>
                                <div className={userInputClass}>
                                    <input placeholder="Username" ref="username" type="text" />
                                    <i className="user icon"></i>
                                </div>
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <div className={passInputClass}>
                                    <input type="password" ref="password" />
                                    <i className="lock icon"></i>
                                </div>
                            </div>
                            <div className={loaderClass} onClick={this._handleSubmit}>Login</div>
                        </div>
        }else{
            outputLogin = <div className="huge blue ui labeled icon button" onClick={self._openLoginForm}>
                                <i className="sign in icon"></i>
                                Login
                            </div>
        }
        return(
            <div>{outputLogin}</div>
        )
    }
});

var SignForm = React.createClass({
    
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
        return this.getStore(AuthStore).getState();         
    },
    _onChange: function () {
        
        this.setState(this.getStateFromStores());
    },
     _openSignUp: function(e) {
        this.props.context.executeAction(loginActions.showSignForm);
    },    
    _handleSubmit: function(e) {
        var username = this.refs.username.getDOMNode().value.trim();
        var password = this.refs.password.getDOMNode().value.trim(); 
        var email = this.refs.email.getDOMNode().value.trim(); 
        this.props.context.executeAction(loginActions.sendSignUp, {username : username, email : email, password: password});
    },
    render: function() {
        var self = this;
        var loaderClass = "ui green submit button";
        if (self.props.isLoggingIn){
            loaderClass = "ui green submit button loading";
        }
        var userInputClass = "ui left icon input";
        
        if (self.state.error){
            if (self.state.error.loginError){
                userInputClass += ' error';
            }            
        }
        var outputSign;
        if (this.state.showSignForm){
            outputSign = <div className="ui form segment">
                        <div className="field">
                            <label>Username</label>
                            <div className={userInputClass}>
                                <input placeholder="Username" ref="username" type="text" />
                                <i className="user icon"></i>
                            </div>
                        </div>
                        <div className="field">
                            <label>Email</label>
                            <div className="ui left icon input">
                                <input placeholder="Email" ref="email" type="text" />
                                <i className="mail icon"></i>
                            </div>
                        </div>
                        <div className="field">
                            <label>Password</label>
                            <div className="ui left icon input">
                                <input type="password" ref="password" />
                                <i className="lock icon"></i>
                            </div>
                        </div>
                        <div className={loaderClass} onClick={this._handleSubmit}>SignUp</div>
                        
                        </div>;
        }else{
            outputSign = <div className="huge green ui labeled icon button" onClick={self._openSignUp}>
                                <i className="signup icon"></i>
                                Sign Up
                            </div> 
        } 
        return(
            <div>{outputSign}</div>
        )}
});

module.exports = LoginPage; 