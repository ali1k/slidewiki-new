'use strict';
var React = require('react');
var StoreMixin = require('fluxible').Mixin;
//stores
var DeckStore = require('../stores/DeckStore');
//SlideWiki components
var DeckView=require('./DeckView.jsx');

var DeckPanel = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [DeckStore]
      }
    },
    getInitialState: function () {
      return this.getStateFromStores();
    },
    getStateFromStores: function () {
      return {
        content: this.getStore(DeckStore).getContent(),
        languageOpen: false
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    languageButtonClick: function(e){
        var state = this.state.languageOpen;
        this.setState({languageOpen: !state});
        e.preventDefault();
    },
    render: function() {
        return (
            <div className="sw-deck-panel">
                <div className="panel">
                    <div className="ui secondary top yellow attached segment grid">

                        <div className="six wide column left floated left aligned">
                            <div>{this.state.content.title}</div>
                        </div>
                        <div className="four wide column right floated right aligned">
                            <div className="ui floating dropdown labeled search icon button tiny yellow fluid">
                                <i className="world icon" onClick={this.languageButtonClick}></i>
                                <span className="text">{this.state.content.language}</span>
                                <div className="menu ui mini " ref="menu" style={{display: this.state.languageOpen ? 'block' : 'none'}}>
                                    <a className="item teal mini">Arabic</a>
                                    <a className="item">Chinese</a>
                                    <a className="item">Danish</a>
                                    <div className="divider"></div>
                                    <div className="item centered header ui grid yellow mini"><span>Translate</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui bottom attached segment">
                    <DeckView id={this.props.id} content={this.state.content} context={this.props.context} />
                </div>
            </div>
        );
    }
});

module.exports = DeckPanel;
