'use strict';
var createStore = require('fluxible-app/utils/createStore');
var routesConfig = require('../configs/routes')

var ApplicationStore = createStore({
  storeName: 'ApplicationStore',
  handlers: {
    'CHANGE_ROUTE_SUCCESS': '_handleNavigate',
    'UPDATE_PAGE_TITLE': 'updatePageTitle'
  },
  initialize: function(dispatcher) {
    this.currentRoute = null;
    this.routes = routesConfig;
    this.pageTitle = '';
  },
  _handleNavigate: function(route) {
    //console.log(route);
    if (this._isTheCurrentRoute(route)) {
      return;
    }
    this.currentRoute = route;
    this.emit('change');
  },
  updatePageTitle: function(title) {
    this.pageTitle = title.pageTitle;
    this.emitChange();
  },
  _isTheCurrentRoute: function(route) {
    if (this.currentRoute && route.path == this.currentRoute.path) {
      return true;
    } else {
      return false;
    }
  },
  getCurrentPageLabel: function() {
    if (this.currentRoute)
      return this.routes[this.currentRoute.name].label;
  },
  getPageTitle: function() {
    return this.pageTitle;
  },
  getState: function() {
    return {
      route: this.currentRoute,
      routes: this.routes,
      pageTitle: this.pageTitle
    };
  },
  dehydrate: function() {
    return this.getState();
  },
  rehydrate: function(state) {
    this.routes = state.routes;
    this.currentRoute = state.route;
    this.pageTitle = state.pageTitle;
  }
});


module.exports = ApplicationStore;
