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
        return {
            isLoggedIn: this.getStore(AuthStore).getIsLoggedIn(),
            isLoggingIn: this.getStore(AuthStore).getIsLoggingIn(),
            currentUser: this.getStore(AuthStore).getCurrentUser(),
            isLoginFormOpened: this.getStore(AuthStore).getIsLoginFormOpened()
        };
    },
    _onChange: function () {
        
        this.setState(this.getStateFromStores());
    },
    render: function() {
        var self = this;
        var userProfile;
        var button;
        var loaderClass = "ui blue submit button";
        if (this.state.isLoggingIn){
            loaderClass = "ui blue submit button loading";
        }
        if (!this.state.currentUser){
            userProfile = <div>Login or register</div> 
        }else{
            userProfile = <div>{this.state.currentUser.username}</div> 
        }
        return (
        <div className="html ui six wide segment">
            <div className="ui two column middle aligned relaxed fitted centered stackable grid ">
                <div className="column four wide">
                    <div className="ui form segment">
                        <div className="field">
                            <label>Username</label>
                            <div className="ui left icon input">
                                <input placeholder="Username" ref="username" type="text" />
                                <i className="user icon"></i>
                            </div>
                        </div>
                        <div className="field">
                            <label>Password</label>
                            <div className="ui left icon input">
                                <input type="password" ref="password" />
                                <i className="lock icon"></i>
                            </div>
                        </div>
                        <div className={loaderClass} onClick={this._handleSubmit}>Login</div>
                    </div>
                </div>
                <div className="ui vertical divider ">
                  Or
                </div>
                <div className="center aligned column four wide"><SignForm context = {context} isLoggingIn = {this.state.isLoggingIn}/></div>
            </div>
        </div>    
        );
    },
    _handleSubmit: function(e) {
        
        var username = this.refs.username.getDOMNode().value.trim();
        var password = this.refs.password.getDOMNode().value.trim(); 
        this.props.context.executeAction(loginActions.sendLogin, {username : username, password: password});
    },
    _handleFacebook: function(e) {
        this.props.context.executeAction(loginActions.sendFacebook, {});
    },

});

var SignForm = React.createClass({
    getInitialState: function () {       
        return {showSignForm : false};
    },
    _openSignUp: function(e) {
        this.setState({ showSignForm: true });
    },
    _handleSubmit: function(e) {
        console.log(this.props.isLoggingIn);
        var username = this.refs.username.getDOMNode().value.trim();
        var password = this.refs.password.getDOMNode().value.trim(); 
        var email = this.refs.email.getDOMNode().value.trim(); 
        this.props.context.executeAction(loginActions.sendSignUp, {username : username, email : email, password: password});
    },
    render: function() {
        var self = this;
        var loaderClass = "ui green submit button";
        if (this.props.isLoggingIn){
            loaderClass = "ui green submit button loading";
        }
        var signButton = <div className="huge green ui labeled icon button" onClick={this._openSignUp}>
                                <i className="signup icon"></i>
                                Sign Up
                            </div>;                        
        var signForm = <div className="ui form segment">
                        <div className="field">
                            <label>Username</label>
                            <div className="ui left icon input">
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
        var output = this.state.showSignForm ? signForm : signButton;
    return(
        <div>{output}</div>
    )}
});

module.exports = LoginPage; 