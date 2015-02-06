'use strict';
//var createStore = require('fluxible-app/utils/createStore');
var request = require('superagent');
var Reflux = require('reflux');
var LoginActions = require('../actions/LoginActions');
var http = require('http');
var api = require('../configs/config').api;
var agent = require('superagent');
var debug = require('debug');
var createStore = require('fluxible/utils/createStore');


var AuthStore = createStore({
    storeName: 'AuthStore',
    handlers: {
        'SEND_LOGIN': 'onSendLogin'
    },
    
    initialize: function () {
        this.currentUser = {};
        this.isLoggedIn = false;
        this.isLoggingIn = false; 
    },
    onSendLogin: function(payload) {
        
        console.log('Im in Store!');
        
        this.isLoggingIn = true;
        
        agent
            .post(api.path + '/login')
            .type('form')
            .send({ username: payload.username, password: payload.password })
            .end(function(err, res){
                if (err){
                    debug(err);
                }
                if (res.id){
                    this._setLoggedIn(res);
                }else{
                    console.log(res);
                }
            });

        
        
    },
    getState: function() {
        return {
            currentUser: this.currentUser,
            isLoggedIn: this.isLoggedIn,
            isLoggingIn: this.isLoggingIn
        };
    },
    getIsLoggingIn : function(){
        return this.isLoggingIn;
    },
    _setLoggedOut: function() {
        localStorage.removeItem('loginToken');
        this.isLoggingIn = false;
        this.isLoggedIn = false;
        return this.emit('change');
    },
    _setLoggedIn: function(user) {
        
        this.isLoggingIn = false;
        this.isLoggedIn = true;
        this.currentUser = user;
        this.emitChange();
       
    }, 
    dehydrate: function () {
        return {
            currentUser: this.currentUser,
            isLoggedIn: this.isLoggedIn,
            isLoggingIn: this.isLoggingIn
        };
    },
    rehydrate: function (state) {
        this.currentUser = state.currentUser;
        this.isLoggedIn = state.isLoggedIn;
        this.isLoggingIn = state.isLoggingIn; 
    }
});

module.exports = AuthStore;


