'use strict';
var createStore = require('fluxible/utils/createStore');
var _ = require('lodash');
var t = require('t');
var debug = require('debug');
var Immutable = require('immutable');
var async = require('async');



module.exports = createStore({
    storeName: 'TreeStore',
    handlers: {
        'SHOW_DECK_TREE_START': '_showDeckTreeStart',
        'SHOW_DECK_TREE_FAILURE': '_showDeckTreeFailure',
        'SHOW_DECK_TREE_SUCCESS': '_showDeckTreeSuccess',
        'UPDATE_TREE_NODE_SELECTOR': '_updateSelector',
        'ON_DRAG_START': '_onDragStart',
        'CHECK_DROP_POSSIBLE' : '_checkDropPossible',
        'MOVE_ITEM' : 'move_item',
        UPDATE_INDEXES : 'update_indexes',
        'ON_DROP' : '_onDrop'
        
    },
    initialize: function () {
        //tree nodes
        this.nodes = {};
        //current node which is selected
        this.selector = {};
        //holds a breadcrumb based on the selector
        this.breadcrumb = [];
        //holds a dragging item
        this.dragging = null;
        this.opened = [];
        this.allowDrop = false;
        this.processing = false;
    },
    //::    [{}] * [] * fn => fn({})
    _getElementByIndex : function(nodes, indexes_array, done){
        this.processing = true;
        if (indexes_array.size){
            if (indexes_array.size === 1){ 
                var first = indexes_array.first();
                return done(nodes.children[first - 1]);
            }else{
                var first = indexes_array.first();
                this._getElementByIndex(nodes.children[first - 1], indexes_array.shift(), done); //shift array, go to next level
            }
        }else{
            return done(null);
        }
    },
    _onDragStart: function (payload) {
        this.dragging = payload;
        this.emitChange();
    },
    _onDrop : function(payload){
        this.processing = false;
        this.allowDrop = false;
        this.dragging = {};
        this.emitChange();
    },
    
    //::    {{source_deck : {f_index : f_index, id : id, type : type}, {target_deck : {f_index : f_incex, id : id}} * fn => fb(bool)
    _isCausingLoop: function(payload, done){
        this.processing = true;
        console.log(payload);
        console.log('in isCausingLoop');
        var deckId = payload.target_deck.id;
        var itemId = payload.source_deck.id;
        var targetDeck = payload.target_deck;
        console.log('target deck is:');
        console.log(targetDeck);
        console.log('checking targetDeck ' + deckId + ' sourcedeck ' +itemId);
        var self = this;
        var i = 0;
        while (deckId > 0) {
            i++;
            console.log('iteration ' + i);
            if (itemId === deckId) {
                console.log('Causing loop: ' + itemId + ' ' + deckId);
                return done(true); //the moving causing loop
            } else {
                console.log('searching parent of ');
                console.log(targetDeck);
                self._getParentOfItem(targetDeck, function(new_parent){
                   
                    if (new_parent){ 
                         console.log('parentOfTarget: ' + new_parent.id);
                        deckId = new_parent.id; 
                        targetDeck = new_parent;
                    }else{
                        console.log('no parent for target ' + targetDeck.id);
                        deckId = -1;
                    }
                });
            }
        }
        return done(false); //the moving does not cause loop
    },
    //::     {f_index : f_index} * this.dragging * fn => fn(bool)
    _checkDropPossible : function(payload, done){ 
        var self = this;
        if (!self.processing && this.dragging){
            self.processing = true;
            console.log('dragging: ' + self.dragging.id);
            console.log('target: ' + payload.id);
            if (this.dragging.type === 'slide'){
                console.log('slide: true');
                self.allowDrop = true;
                self.emitChange();
                self.processing = false;
            }else{                
                var myImmutable = Immutable.List(self._transformIndexToArray(payload.f_index)); //array of indexes, must not be mutated
                var indexes_array = myImmutable; //mutable copy
                self._getElementByIndex(self.nodes, indexes_array, function(node){ //the drop target node
                    console.log('========================');
                    console.log(node);
                    if (!node) {
                        self.allowDrop = true; //we are in root
                    } else{
                       if (node.type === 'slide'){
                        self._getParentOfItem(payload, function(parent){ //get a parentdeck of drop target
                            if (!parent){
                                console.log('no_parent: true');
                                self.allowDrop = true; //we are in root
                                self.processing = false;
                                self.emitChange();
                            }else{
                                console.log('parent:');
                                console.log(parent);
                                self._isCausingLoop({source_deck : self.dragging , target_deck : parent}, function(res){
                                    console.log('ontoslide: ' + !res);
                                    self.allowDrop = !res;
                                    self.processing = false;
                                    self.emitChange();
                                });
                            }
                        });                    
                        }else{ //dropping target is a deck
                            self._isCausingLoop({source_deck : self.dragging, target_deck : node}, function(res){
                                console.log('ontodeck: ' + !res);
                                self.allowDrop = !res;
                                self.processing = false;
                                self.emitChange();
                            });
                        } 
                    }
                    
                });
            }
            
       
        }else{
            self.sllowDrop = false;
        }
        
    },
    //::    {f_index : f_index} * fn * this.nodes => fn(this.node)
    _getParentOfItem : function(payload, callback){ 
        if (payload.f_index.length){
            var self = this;
           
            var myImmutable_new = Immutable.List(self._transformIndexToArray(payload.f_index)); //Immutable array of indexes
            
            var indexes_array = myImmutable_new; //mutable copy
            var parent_index = indexes_array.pop();
            if (parent_index) { //parent is NOT a root
                self._getElementByIndex(self.nodes, parent_index, function(parent){ //parent
                    return callback(parent);
                });
            } else { //parent is a root deck
                return callback(self.nodes);
            } 
        }else{
            return callback(null);
        }
        
    },
    insertInto : function(payload){
        var self = this;
        this._getParentOfItem(payload, function(parent){
            if (!parent) parent = self.nodes;
            var myImmutable = Immutable.List(self._transformIndexToArray(payload.f_index)); //array of indexes, must not be mutated
            var index_in_parent = myImmutable.last() - 1;
            var new_node = payload.node;
            parent.children.splice(index_in_parent, 0, new_node);
            self.emitChange();
        });
    },
    removeFrom : function(payload, callback){
        var self = this;
        this._getParentOfItem(payload, function(parent){
            if (!parent) parent = self.nodes;
            var myImmutable = Immutable.List(self._transformIndexToArray(payload.f_index)); //array of indexes, must not be mutated
            var new_indexes_array = myImmutable; //mutable copy
            if (!new_indexes_array.size) {new_indexes_array = myImmutable.push('0')};
            var index_in_parent = new_indexes_array.last() - 1;
            console.log(index_in_parent);
            parent.children.splice(index_in_parent, 1);
            return callback();
        });
    },
    _transformIndexToArray : function(f_index){
        if (f_index){
            f_index += '';
            if (f_index.indexOf(':') !== -1){
                return (f_index.split(':'));
            }else{
                return ([f_index]);
            }
        }else{
            return null;
        }
    },
    //:: {f_index : f_index} * this.dragging * this.nodes => fn()
move_item : function(payload){
        console.log('Moving item');
        console.log('====================');
        if (this.allowDrop){    
            console.log('Drop is allowed for source ' + this.dragging.id + 'and target ' + payload.id);
            var self = this;           
            this.processing = true;
            var myImmutable = Immutable.List(self._transformIndexToArray(payload.f_index)); //array of indexes, must not be mutated
            var indexes_array = myImmutable; //mutable copy
            
            var promiseTarget = new Promise(function(resolve, reject) {
                self._getElementByIndex(self.nodes, indexes_array, function(node){ //the drop target node 
                    if (!node) {node = self.nodes;}
                    console.log('Found target element');
                    console.log(node);
                    
                    if (node) {
                        console.log('succeedtarget');
                        resolve(node);
                    }else {
                        reject(Error("It broke"));
                    }
                });
            });
            var self = this;
            var new_myImmutable = Immutable.List(self._transformIndexToArray(self.dragging.f_index)); //array of indexes, must not be mutated
            var new_indexes_array = new_myImmutable; //mutable copy
            var promiseDragging = new Promise(function(resolve, reject){             
                self._getElementByIndex(self.nodes, new_indexes_array, function(dragging_node){ //dragging node
                    console.log('Found dragging element');
                    console.log(dragging_node);
                    if (dragging_node){
                        console.log('succedfragging');
                        resolve(dragging_node);
                    }else{
                        reject(Error('it broke'));
                    }
                });                
            });            
//            promiseTarget.then(function(result) {
//                console.log(result); // "Stuff worked!"
//            }, function(err) {
//                console.log(err); // Error: "It broke"
//            });
//            

            
            Promise.all([promiseTarget, promiseDragging]).then(function(result) {
                var node = result[0];
                var dragging_node = result[1];
                if (node.type === 'slide'){ //add item after the slide
                    var after_index = myImmutable.last();
                    var futureF_index_ar = myImmutable.set(-1, after_index);
                    var futureF_index = futureF_index_ar.join(':');
                    
                    self.removeFrom({f_index : self.dragging.f_index}, function(){
                        self.insertInto({f_index : futureF_index, node : dragging_node}) //the last element of node.f_index + 1
                        self.nodes = self._setIndexes(self.nodes);
                        self.processing = false;
                        self.emitChange();
                    });                        
                    
                }
                else{
                    self.removeFrom({f_index : self.dragging.f_index}, function(){
                        node.children.unshift(dragging_node);
                    });
                    self.nodes = self._setIndexes(self.nodes);
                    self.processing = false;
                    self.emitChange();
                }
            }, function() {
                console.log('error');
            });
            
        };
    },
            
                
            
                
                
//                
            
  
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
            var new_index = index - 0 + 1;
            if (nodes.f_index){                
                node.f_index = nodes.f_index + ':' + new_index;
            }else{
                node.f_index = new_index;
            }
            if (self.dragging){
                if (node.id === self.dragging.id && node.type === self.dragging.type){
                    self.dragging.f_index = node.f_index;
                }
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
        this.nodes.type = 'deck';
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
