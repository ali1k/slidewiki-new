'use strict'
var React = require('react');
//stores
var AuthStore = require('../stores/AuthStore');
var StoreMixin = require('fluxible-app').StoreMixin;
var sendLogin = require('../actions/sendLogin');

var LoginPage = React.createClass({
    
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [AuthStore]
      }
    },
    getInitialState: function () {
        return this.getStore(AuthStore).getState();
    },
    _onChange: function () {
        var state = this.getStore(AuthStore).getState();
        this.setState(state);
    },
    render: function() {
        var self = this;
        return (
            <div className="form-login" title="Login">
                
                    <div className="input-group field">
                        <span className="input-group-addon"><i className="fa fa-user fa-fw"></i></span>
                        <input type="text" className="form-control" placeholder="Usernamexx" ref="username" required/>
                    </div>
                    <div className="input-group field">
                        <span className="input-group-addon"><i className="fa fa-lock fa-fw"></i ></span>
                        <input type="password" className="form-control" placeholder="Passwordxx" ref="password" required/>
                    </div>
                    <div className="field">
                        <button onClick={this._handleSubmit} className="btn btn-primary btn-block" >Log in </button>
                    </div>
                    
                
            </div>
        );
    },
    _handleSubmit: function(e) {
        console.log('submitting');
        var username = this.refs.username.getDOMNode().value.trim();
        var password = this.refs.password.getDOMNode().value.trim(); 
        this.props.context.executeAction(sendLogin, {username : username, password: password});
    }

});

 
 
module.exports = LoginPage; 