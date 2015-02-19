'use strict';
var createStore = require('fluxible/utils/createStore');
var _ = require('lodash');
var t = require('t');
var debug = require('debug');
var Immutable = require('immutable');
var async = require('async');
var agent = require('superagent');
var api = require('../configs/config').api;
//error messages: 
var internal =  {message : 'An internal error occured, please try one more time'};



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
        'ON_DROP' : '_onDrop',
        'DELETE_FROM' : 'delete_from',
        'ADD_EMPTY_SLIDE' : 'addEmptySlide'
        
    },
    initialize: function () {
        //tree nodes
        this.nodes = {};
        //current node which is selected
        this.selector = {};
        this.selected = {};
        //holds a breadcrumb based on the selector
        this.breadcrumb = [];
        //holds a dragging item
        this.dragging = null;
        this.opened = [];
        this.allowDrop = false;

        this.targetDeck = null;
    },
    //::    [{}] * [] * fn => fn({})
//    _getElementByIndex : function(nodes, indexes_array, done){
//        if (indexes_array.size){
//            if (indexes_array.size === 1){ 
//                var first = indexes_array.first();
//                if (nodes.children[first - 1]){
//                    return done(nodes.children[first-1]);
//                }else{
//                    return done(null);
//                }
//            }else{
//                var first = indexes_array.first();
//                if (nodes.children){
//                    this._getElementByIndex(nodes.children[first - 1], indexes_array.shift(), done); //shift array, go to next level
//                }else{
//                    
//                }
//            }
//        }else{
//            return done(null);
//        }
//    },
    _onDragStart: function (payload) {
        this.dragging = payload;
        this.emitChange();
    },    
    delete_from : function(payload){
        var self = this;
        agent
            .get(api.path + '/deleteFrom/'+payload.parent.id+'/'+payload.type+'/'+payload.id)
            .end(function(err, res){
                if (err){
                    self.error = internal;
                    return self.emitChange();
                }
                else{
                    var next = payload.parent.children[payload.index];
                    var selector, selected;
                    if (next){
                        selected = next;
                        selector = {id: next.id, type: next.type, title: next.title, parent: self.selector.parent};
                    }else{
                        next = self.selector.parent.state.item;
                        selector = {id: next.id, type: next.type, title: next.title, parent: self.selector.parent.props.parent};
                        selected = next;
                    }
                    self._updateSelector({selector: selector, selected: selected});
                    
                    
                    //self.selected = self.nodes;
                    //self.selector = {id: self.nodes.id, type: 'deck'};
                    return self.emitChange();
                }
            });
    },
    
    addEmptySlide : function(payload){
        //todo for now the user-id '3' is used - change it in treepanel
        //todo parent_deck_id should be different if slide is selected
        var self = this;
        if (self.selected.type === 'deck'){
            agent
                .post(api.path + '/slide/new')
                .type('form')
                .send({ title: payload.title, 
                        user_id: payload.user_id, 
                        body : payload.body, 
                        language: payload.language, 
                        position : payload.position, 
                        parent_deck_id: self.selected.id 
                    })
                    .end(function(err, res){
                        if (err){
                            self.error = internal;
                            return self.emitChange();
                        }
                        else{
                            var new_slide = payload;
                            new_slide.id = res.body.id;
                            var myImmutable = Immutable.List(self._transformIndexToArray(self.selected.f_index));
                            var index_in_parent = self.selected.children.length + 1;
                            var futureF_index_array = myImmutable.push(index_in_parent); //futureIndex
                            var futureF_index = futureF_index_array.join(':');
                            new_slide.parentID = self.selected.id;
                            new_slide.position = index_in_parent;
                            new_slide.type = 'slide';
                            new_slide.f_index  = futureF_index;
                            self.insertInto({f_index : futureF_index, node : new_slide}); 
                            var new_nodes = self._setIndexes(self.nodes);
                            self.nodes = new_nodes;
                            self.selected = new_slide;
                            self.selector  = {type: 'slide', id: new_slide.id.toString()};
                            self.emitChange();
                        }
                    });

        }else{
            
            self._getParentOfItem({f_index : self.selected.f_index}, function(parent){
                if (!parent) parent = self.nodes;
                var myImmutable = Immutable.List(self._transformIndexToArray(self.selected.f_index)); //selected slide
                var after_index = myImmutable.last() - 0 + 1; //new position

                agent
                .post(api.path + '/slide/new')
                .type('form')
                .send({ title: payload.title, 
                        user_id: payload.user_id, 
                        body : payload.body, 
                        language: payload.language, 
                        position : after_index, 
                        parent_deck_id: parent.id 
                    })
                    .end(function(err, res){
                        if (err){
                            self.error = internal;
                            return self.emitChange();
                        }
                        else{
                            var new_slide = payload;
                            new_slide.id = res.body.id;
                            var parent_index = Immutable.List(self._transformIndexToArray(parent.f_index)); //parent f_index
                            var new_index = parent_index.push(after_index); //new f_index_array;
                            var futureF_index = new_index.join(':'); 
                            new_slide.parentID = parent.id;
                            new_slide.position = after_index;
                            new_slide.type = 'slide';
                            self.insertInto({f_index : futureF_index, node : new_slide}); 
                            var new_nodes = self._setIndexes(self.nodes);
                            self.nodes = new_nodes;
                            self.selected = new_slide;
                            self.selector  = {type: 'slide', id: new_slide.id.toString()};
                            self.emitChange();
                        };
                    });
            
            });
        }
    },
    
    _onDrop : function(payload){
        this.allowDrop = false;
        var self = this; 
        var query = {};
        var source_index = payload.source_index + 1;
        var target_index = payload.target_index + 1;
        var source = payload.source_parent.id;
        var target = payload.target_parent.id;
        console.log(source);
        console.log(target);
        agent
                .get(api.path + '/moveItem/' + source + "/" + source_index + "/" + target + "/" + target_index) 
                .end(function(err, res){
                    if (err){
                        self.error = internal;
                        return self.emitChange();
                    }else{
                        if (res.body.error){
                            console.log(res.body.error[0]);
                        }else{
                            console.log('_onDrop done');
                            self.dragging = {};
                            self.emitChange();
                        }
                    }
                });
        
    },
    
    //::    {{source_deck : {f_index : f_index, id : id, type : type}, {target_deck : {f_index : f_incex, id : id}} * fn => fb(bool)
    _isCausingLoop: function(payload, done){
        console.log('_isCausing loop');
        var deckId = payload.target_deck.state.item.id;
        var itemId = payload.source_deck.state.item.id;
        var targetDeck = payload.target_deck;
        var i = 0;
        while (deckId > 0) {
            i++;
            if (itemId === deckId) {
                return done(true); //the moving causing loop
            } else {
                var new_parent = targetDeck.props.parent;
                if (new_parent){    
                    deckId = new_parent.state.item.id; 
                    targetDeck = new_parent;
                }else{                    
                    deckId = -1;
                }
               
            }
        }
        
        return done(false); //the moving does not cause loop
    },
    //::     {f_index : f_index} * this.dragging * fn => fn(bool)
    _checkDropPossible : function(payload, done){ 
        var self = this;
        if (this.dragging){
            
            if (this.dragging.state.item.type === 'slide'){
                self.allowDrop = true;
                console.log('checkdrposs slide done');
                console.log(self.allowDrop);
                self.emitChange();

            }else{
                var target_item = payload.state.item;
                if (target_item.type ==='slide'){
                    var parent = payload.props.parent;
                    if (parent.state.item.id === self.nodes.id){ //we are dropping in the root deck
                        self.allowDrop = true;
                        self.emitChange();
                    }else{
                        self._isCausingLoop({source_deck : self.dragging , target_deck : parent}, function(res){
                            self.allowDrop = !res;
                            console.log('checkdrposs deck-slide done');
                            console.log(self.allowDrop);
                            self.emitChange();
                        });
                    }
                }else{ //dropping target is a deck
                    self._isCausingLoop({source_deck : self.dragging, target_deck : payload}, function(res){
                        self.allowDrop = !res;
                        self.processing = false;
                        console.log('checkdrposs deck-deck done');
                        console.log(self.allowDrop);
                        self.emitChange();
                    });
                    
                }
            }
        }else{
            console.log('checkdrposs done');
            self.sllowDrop = false;
            console.log(self.allowDrop);
            self.emitChange();
        }
        
    },
    //::    {f_index : f_index} * fn * this.nodes => fn(this.node)
//    _getParentOfItem : function(payload, callback){         
//        if (payload.f_index.length){
//            var self = this;
//            
//            var myImmutable_new = Immutable.List(self._transformIndexToArray(payload.f_index)); //Immutable array of indexes
//            
//            var indexes_array = myImmutable_new; //mutable copy
//            var parent_index = indexes_array.pop();
//            if (parent_index) { //parent is NOT a root
//                self._getElementByIndex(self.nodes, parent_index, function(parent){ //parent
//                    callback(parent);
//                });
//            } else { //parent is a root deck
//                callback(self.nodes);
//            } 
//        }else{
//            callback(null);
//        }
//        
//    },
//    insertInto : function(payload){
//        var self = this;
//        this._getParentOfItem(payload, function(parent){
//            if (!parent) parent = self.nodes;
//            var myImmutable = Immutable.List(self._transformIndexToArray(payload.f_index)); //array of indexes, must not be mutated
//            var index_in_parent = myImmutable.last() - 1;
//            var new_node = payload.node;
//            parent.children.splice(index_in_parent, 0, new_node);
//            self.emitChange();
//        });
//    },
//    removeFrom : function(payload, callback){
//        var self = this;
//        this._getParentOfItem(payload, function(parent){            
//            if (!parent) parent = self.nodes;
//            var myImmutable = Immutable.List(self._transformIndexToArray(payload.f_index)); //array of indexes, must not be mutated
//            var new_indexes_array = myImmutable; //mutable copy            
//            var index_in_parent = new_indexes_array.last() - 1;
//            parent.children.splice(index_in_parent, 1);
//            return callback();
//        });
//    },
//    _transformIndexToArray : function(f_index){
//        if (f_index){
//            f_index += '';
//            if (f_index.indexOf(':') !== -1){
//                return (f_index.split(':'));
//            }else{
//                return ([f_index]);
//            }
//        }else{
//            return null;
//        }
//    },
//    //:: {f_index : f_index} * this.dragging * this.nodes => fn()
//    move_item : function(payload){
//        if (this.allowDrop){ 
//            var self = this;
//            var myImmutable = Immutable.List(self._transformIndexToArray(payload.f_index)); //array of indexes, must not be mutated
//            var indexes_array = myImmutable; //mutable copy
//            
//            var promiseTarget = new Promise(function(resolve, reject) {
//                self._getElementByIndex(self.nodes, indexes_array, function(node){ //the drop target node 
//                    if (!node) {node = self.nodes;}
//                    if (node) {
//                        resolve(node);
//                    }
//                });
//            });
//            var new_myImmutable = Immutable.List(self._transformIndexToArray(self.dragging.f_index)); //array of indexes, must not be mutated
//            var new_indexes_array = new_myImmutable; //mutable copy
//            var promiseDragging = new Promise(function(resolve, reject){             
//                self._getElementByIndex(self.nodes, new_indexes_array, function(dragging_node){ //dragging node
//                    if (dragging_node){
//                        resolve(dragging_node);
//                    }
//                });                
//            });            
//            Promise.all([promiseTarget, promiseDragging]).then(function(result) {
//                var node = result[0];
//                var dragging_node = result[1];
//                if (node.type === 'slide'){ //add item after the slide
//                    var after_index = myImmutable.last();
//                    var futureF_index_ar = myImmutable.set(-1, after_index);
//                    var futureF_index = futureF_index_ar.join(':');                    
//                    self.removeFrom({f_index : self.dragging.f_index}, function(){
//                        self.insertInto({f_index : futureF_index, node : dragging_node}) //the last element of node.f_index + 1
//                        self.nodes = self._setIndexes(self.nodes);
//                        self.emitChange();
//                    });                        
//                    
//                }
//                else{
//                    self.removeFrom({f_index : self.dragging.f_index}, function(){
//                        node.children.unshift(dragging_node);
//                        self.nodes = self._setIndexes(self.nodes);
//                        self.emitChange();
//                    });
//                    
//                }
//            }, function() {
//                console.log('error');
//            });
//            
//        };
//    },
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
    _setIndexes : function(nodes){ //to be able to produce keys for nodes
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
        var self = this;
        this.nodes = this._setIndexes(res.nodes);
        this.nodes.type = 'deck';
        this.nodes.id = res.selector.id;
        this.selector = res.selector;
        self._createBreadcrumb(self.selector, [], function (path) {
            console.log(path);
            self.breadcrumb = path;
            self.emitChange();
        });
    },
   
    _updateSelector: function(res) {
        this.selector = res.selector;
        if (res.selected){
            this.selected = res.selected;
        }else{
            this.selected = this.nodes;
        }
        
        var self = this;
        this._createBreadcrumb(self.selector, [], function(path){
            self.breadcrumb = path;
            self.emitChange();
        });
    },
    
    _createBreadcrumb : function(selector, path_acc, callback){
        var self = this;
        if (selector.parent){ //not a root deck 
            path_acc.unshift({id : selector.id, title: selector.title});
            var selector = {id : selector.parent.state.item.id, title: selector.parent.state.item.title, parent: selector.parent.props.parent}
            self._createBreadcrumb(selector, path_acc, callback); //shift array, go to next level
        }else{ //root deck 
            path_acc.unshift({id : self.nodes.id, title: self.nodes.title});
            return callback(path_acc);
        } 
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
    getSelected: function(){
       return this.selected; 
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
            allowDrop: this.allowDrop,
            selected: this.selected,
        };
    },
    dehydrate: function () {
        return {
            nodes: this.nodes,
            selector: this.selector,
            breadcrumb: this.breadcrumb,
            isOpened: this.isOpened,
            dragging: this.dragging,
            allowDrop: this.allowDrop,
            selected: this.selected,
        };
    },
    rehydrate: function (state) {
        this.nodes = state.nodes;
        this.selector = state.selector;
        this.breadcrumb = state.breadcrumb;
        this.isOpened = state.isOpened;
        this.dragging = state.dragging;
        this.allowDrop = state.allowDrop;
        this.selected = state.selected;
    }
});
