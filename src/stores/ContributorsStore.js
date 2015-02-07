'use strict';
var createStore = require('fluxible/utils/createStore');


module.exports = createStore({
  storeName: 'ContributorsStore',
  handlers: {
    'SHOW_CONTRIBUTORS_START': '_showContributorsStart',
    'SHOW_CONTRIBUTORS_FAILURE': '_showContributorsFailure',
    'SHOW_CONTRIBUTORS_SUCCESS': '_showContributorsSuccess'
  },
  initialize: function () {
    this.contributors=[];
  },
  _showContributorsStart: function (res) {
    //console.log('Start loading contributors...');
  },
  _showContributorsFailure: function (res) {
    console.log('Error in loading contributors!');
    this.error = res;
    this.emitChange();
  },
  _showContributorsSuccess: function (res) {
    this.contributors=res.contributors;
    this.emitChange();
  },
  getContributors: function () {
    return this.contributors;
  },
  getError: function() {
    return this.error;
  },
  dehydrate: function () {
    return {
      contributors: this.contributors,
    };
  },
  rehydrate: function (state) {
    this.contributors = state.contributors;
  }
  
});
