'use strict'
var React = require('react');
//stores
var AuthStore = require('../stores/AuthStore');
var LoginActions = require('../actions/LoginActions');

var LoginPage = React.createClass({
    
    getInitialState: function () {
      return {}
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
                    <div className="field">
                        <button className="btn btn-primary btn-block" >Log out </button>
                    </div>
                
            </div>
        );
    },
    _handleSubmit: function(e) {
        console.log('submitting');
        var username = this.refs.username.getDOMNode().value.trim();
        var password = this.refs.password.getDOMNode().value.trim(); 
        LoginActions.sendLoginActions(username, password);
    }

});

 
 
module.exports = LoginPage; 