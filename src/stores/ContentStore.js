'use strict';
var createStore = require('fluxible-app/utils/createStore');


module.exports = createStore({
  storeName: 'ContentStore',
  handlers: {
    'PREPARE_CONTENT_TYPE': '_prepareContentType'
  },
  initialize: function () {
    this.content_type='';
    this.content_id=0;
  },
  _prepareContentType: function (res) {
    this.content_type = res.selector.type;
    this.content_id = res.selector.id;
    this.emitChange();
  },
  getContentType: function () {
    return this.content_type;
  },
  getContentID: function () {
    return this.content_id;
  },
  dehydrate: function () {
    return {
      content_type: this.content_type,
      content_id: this.content_id
    };
  },
  rehydrate: function (state) {
    this.content_type = state.content_type;
    this.content_id = state.content_id;
  }
});
