'use strict';
//var createStore = require('fluxible-app/utils/createStore');
var request = require('superagent');
var Reflux = require('reflux');
var LoginActions = require('../actions/LoginActions');
var http = require('http');
var api = require('../configs/config').api;
var agent = require('superagent');


var AuthStore = Reflux.createStore({
    listenables: [LoginActions],
    storeName: 'AuthStore',
    initialize: function () {
        this.currentUser = 'darya';
        this.isLoggedIn = false;
        this.isLoggingIn = false; 
    },
    onSendLoginActions: function(username, password) {
        
        api.path = api.path + '/login';
        
        this.isLoggingIn = true;
        
        agent
            .post('http://localhost:8080/api/login')
            .type('form')
            .send({ username: username, password: password })
            .end(function(err, res){ console.log(res);});
//        api
//            .post(config.apiRoot + '/login')
//            .send({
//                username: username,
//                password: password
//            })
//            .set('Accept', 'application/json')
//            .end(function(res) {
//                console.log(res);
//            }); 
        
        
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
    _setLoggedIn: function(token) {
        if (token != null || token != '') {
            localStorage.setItem('loginToken', token);
            this.isLoggingIn = false;
            this.isLoggedIn = true;
            return this.emit('change');
        } else {
            console.log('errror');
            return _setLoggedOut({
                error: "There was an error logging in."
            });
        }
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


