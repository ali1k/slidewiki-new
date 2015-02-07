'use strict';
var api = require('../configs/config').api;
var agent = require('superagent');
var debug = require('debug');
var createStore = require('fluxible/utils/createStore');



var AuthStore = createStore({
    storeName: 'AuthStore',
    handlers: {
        'SEND_LOGIN': 'onSendLogin',
        'SEND_FACEBOOK': 'onSendFacebook',
        'SEND_SIGNUP' : 'onSendSignUp',
        'OPEN_FORM': 'onFormOpen',
        'CLOSE_FORM': 'onFormClose'
    },
    
    initialize: function () {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.isLoggingIn = false; 
        this.isFormOpened = false;
    },
    onFormOpen: function(payload){
        this.isFormOpened = true;
        this.emitChange();
    },
    onFormClose: function(payload){
        this.isFormOpened = false;
        this.emitChange();
    },
    getIsLoginFormOpened: function(){
        return this.isFormOpened;
    },
    onSendLogin: function(payload) {
        this.isLoggingIn = true;
        this.emitChange();
        var self = this;
        agent
            .post(api.path + '/login')
            .type('form')
            .send({ username: payload.username, password: payload.password })
            .end(function(err, res){
                if (err){
                    debug(err);
                }
                if (res.body.id){
                    debug('res.id');
                    debug(res.body);
                    self._setLoggedIn(res.body);
                    self.emitChange();
                }else{
                    debug('no res id');
                    debug(res.body);
                }
            });
    },
    onSendSignUp :  function(payload) { 
        this.isLoggingIn = true;
        this.emitChange();
        var self = this;
        agent
            .post(api.path + '/signup')
            .type('form')
            .send({ username: payload.username, password: payload.password, email: payload.email })
            .end(function(err, res){
                if (err){
                    debug(err);
                }
                if (res.body.id){
                    debug('res.id');
                    debug(res.body);
                    self._setLoggedIn(res.body);
                    self.emitChange();
                }else{
                    debug('no res id');
                    debug(res.body);
                }
            });
    },
    onSendFacebook: function(payload) {
        this.isLoggingIn = true;
        this.emitChange();
        var self = this;
        agent
            .get(api.path + '/auth/facebook')
            .end(function(err, res){
                console.log(err);
                if (err){
                    console.log(err);
                }
                if (res.body.id){
                    console.log('res.id');
                    console.log(res.body);
                    self._setLoggedIn(res.body);
                    self.emitChange();
                }else{
                    console.log('no res id');
                    console.log(res.body);
                }
            });
    },
    getState: function() {
        
        return {
            currentUser: this.currentUser,
            isLoggedIn: this.isLoggedIn,
            isLoggingIn: this.isLoggingIn,
            isFormOpened: this.isFormOpened,
        };
        
    },
    getIsLoggingIn : function(){
        return this.isLoggingIn;
    },
    getIsLoggedIn : function(){
        return this.isLoggedIn;
    },
    getCurrentUser : function(){
        return this.currentUser;
    },
    _setLoggedOut: function() {
        //localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.isLoggingIn = false;
        this.isLoggedIn = false;
        this.isFormOpened = false;
        return this.emitChange();
    },
    _setLoggedIn: function(user) {
        //localStorage.setItem('currentUser', user);
        this.isLoggingIn = false;
        this.isLoggedIn = true;
        this.currentUser = user;
        this.isFormOpened = false;
        return this.emitChange();
        
    }, 
    dehydrate: function () {
        return this.getState();
    },
    rehydrate: function (state) {
        this.currentUser = state.currentUser;
        this.isLoggedIn = state.isLoggedIn;
        this.isLoggingIn = state.isLoggingIn; 
        this.isFormOpened = state.isFormOpened;
    }
});

module.exports = AuthStore;


