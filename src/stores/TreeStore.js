'use strict';
var createStore = require('fluxible/utils/createStore');
var _ = require('lodash');
var t = require('t');
var debug = require('debug');
var Immutable = require('immutable');



module.exports = createStore({
    storeName: 'TreeStore',
    handlers: {
        'SHOW_DECK_TREE_START': '_showDeckTreeStart',
        'SHOW_DECK_TREE_FAILURE': '_showDeckTreeFailure',
        'SHOW_DECK_TREE_SUCCESS': '_showDeckTreeSuccess',
        'UPDATE_TREE_NODE_SELECTOR': '_updateSelector',
        'ON_DRAG_START': '_onDragStart',
        'CHECK_DROP_POSSIBLE' : '_checkDropPossible',
        
    },
    initialize: function () {
        //tree nodes
        this.nodes = {};
        //current node which is selected
        this.selector = {};
        //holds a breadcrumb based on the selector
        this.breadcrumb = [];
        //holds a dragging item
        this.dragging = {};
        this.opened = [];
        this.allowDrop = false;
    },
    //::    [{}] * [] * fn => fn({})
    _getElementByIndex : function(nodes, indexes_array, done){
        if (indexes_array.size === 1){ 
            var first = indexes_array.first();
            return done(nodes[first]);
        }else{
            var first = indexes_array.first();
            this._getElementByIndex(nodes[first].children, indexes_array.shift(), done); //shift array, go to next level
        }        
    },
    _onDragStart: function (payload) {
        this.dragging = payload;
        this.emitChange();
    },
    //::    {{source_deck : {f_index : f_index}, {target_deck : {f_index : f_incex}} * fn => fb(bool)
    _isCausingLoop: function(payload, done){
        var deckId = payload.target_deck.id;
        var itemId = payload.source_deck.id;
        var self = this;
        while (deckId) {
            if (itemId === deckId) {
                return done(true); //the moving causing loop
            } else {
                self._getParentOfItem(payload.target_deck, function(new_parent){
                    if (new_parent){
                        deckId = new_parent.id; 
                    }else{
                        deckId = null;
                    }
                });
            }
        }
        return done(false); //the moving does not cause loop
    },
    //::     {f_index : f_index} * this.dragging * fn => fn(bool)
    _checkDropPossible : function(payload, done){ 
        var self = this;
        if (this.dragging){
           
            if (this.dragging.type === 'slide'){
                self.allowDrop = true;
                self.emitChange();
            }else{
                
                var myImmutable = Immutable.List(payload.f_index.split(':')); //array of indexes, must not be mutated
                var indexes_array = myImmutable; //mutable copy
                self._getElementByIndex(self.nodes.children, indexes_array, function(node){ //the drop target node
                    if (node.type === 'slide'){
                        self._getParentOfItem(payload, function(parent){ //get a parentdeck of drop target
                            self._isCausingLoop({source_deck : self.dragging , target_deck : parent}, function(res){ 
                                self.allowDrop = !res;
                                self.emitChange();
                            });
                        });                    
                    }else{ //dropping target is a deck
                        self._isCausingLoop({source_deck : self.dragging, target_deck : node}, function(res){
                            self.allowDrop = !res;
                            self.emitChange();
                        });
                    }
                });
            }
            
        }
    },
    //::    {f_index : f_index} * fn * this.nodes => fn(this.node)
    _getParentOfItem : function(payload, callback){ 
        if (payload.f_index.length){
            var self = this;
            var myImmutable = Immutable.List(payload.f_index.split(':')); //Immutable array of indexes
            var indexes_array = myImmutable; //mutable copy
            var parent_index = indexes_array.pop();
            if (parent_index) { //parent is NOT a root
                self._getElementByIndex(self.nodes.children, indexes_array.pop(), function(parent){ //parent
                    return callback(parent);
                });
            } else { //parent is a root deck
                return callback(self.nodes);
            } 
        }else{
            return callback(null);
        }
        
    },
    _openCloseTree: function () {
        this.isOpened = !this.isOpened;
        this.emitChange();
    },
    _showDeckTreeStart: function (res) {
        debug('Start loading the deck tree...');
    },
    _showDeckTreeFailure: function (res) {
        debug('Error in loading deck tree!');
        var self = this;
        this.error = true;
        self.emitChange();
    },
    _setIndexes : function(nodes){
        var self = this;
        
        var mutated_notes = nodes.children.map(function(node, index){
            node = nodes.children[index];
            if (nodes.f_index){
                node.f_index = nodes.f_index + ':' + index;
            }else{
                node.f_index = index;
            }
            if (node.children){
                return self._setIndexes(node);
            }else{
                return node;
            };
        });
        nodes.children = mutated_notes;
        return nodes;
    },
    _showDeckTreeSuccess: function (res) {
        debug('Success in loading deck tree!');
        this.nodes = this._setIndexes(res.nodes);
        this.selector = res.selector;
        //console.log('change emitted by Tree store!');
        this.emitChange();
        var self = this;
        
        this._createBreadcrumb(function (path) {
            self.breadcrumb = path;
            self.emitChange();
        });
    },
    _updateSelector: function (res) {
        this.selector = res.selector;
        var self = this;
        this._createBreadcrumb(function (path) {
            self.breadcrumb = path;
            self.emitChange();
        })
    },
    //fn callback function
    _createBreadcrumb: function (fn) {
        var found = 0;
        var self = this;
        //collect first level nodes for DFS
        var firstlevel = [];
        _.forEach(self.nodes.children, function (node) {
            if (node.type == 'deck') {
                firstlevel.push(node.id);
            }
        });
        var path = [];
        t.dfs(self.nodes, [], function (node, par, ctrl) {
            if (node.type == 'deck') {
                if (_.indexOf(firstlevel, node.id) > 0) {
                    path = [{
                            id: self.nodes.id,
                            title: self.nodes.title
                        }];
                }
                if (!found) {
                    path.push({
                        id: node.id,
                        title: node.title
                    });
                }
            }
            if (node.id == self.selector.id && node.type == self.selector.type) {
                //prevent duplicate decks in path
                if (node.type != 'deck') {
                    path.push({
                        id: node.id,
                        title: node.title
                    });
                }
                //id found
                found = 1;
                return fn(path);
            }
        })
    },
    getBreadcrumb: function () {
        return this.breadcrumb;
    },
    getNodes: function () {
        return this.nodes;
    },
    getError: function () {
        return this.error;
    },
    //this method checks if we already received the complete tree
    //it is used for preventing rendering/API calls on each request
    //todo: we can change this on update actions to reload tree
    isAlreadyComplete: function () {
        if (JSON.stringify(this.nodes) === '{}') {
            //empty
            return false;
        } else {
            return true;
        }
    },
    getRootDeckID: function () {
        return this.nodes.id;
    },
    getRootDeckTitle: function () {
        return this.nodes.title;
    },
    getDragging: function () {
        return this.dragging;
    },
    getSelector: function () {
        return this.selector;
    },
    getAllowDrop: function() {
        return this.allowDrop;
    },
    getState: function () {
        return {
            nodes: this.nodes,
            selector: this.selector,
            breadcrumb: this.breadcrumb,
            isOpened: this.isOpened,
            dragging: this.dragging,
            allowDrop: this.allowDrop
        };
    },
    dehydrate: function () {
        return {
            nodes: this.nodes,
            selector: this.selector,
            breadcrumb: this.breadcrumb,
            isOpened: this.isOpened,
            dragging: this.dragging,
            allowDrop: this.allowDrop
        };
    },
    rehydrate: function (state) {
        this.nodes = state.nodes;
        this.selector = state.selector;
        this.breadcrumb = state.breadcrumb;
        this.isOpened = state.isOpened;
        this.dragging = state.dragging;
        this.allowDrop = state.allowDrop;
    }
});
