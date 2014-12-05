'use strict';
var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
//stores
var DeckSliderStore = require('../stores/DeckSliderStore');
//actions
var navigateAction = require('flux-router-component/actions/navigate');

var SlideView = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [DeckSliderStore]
      }
    },
    getInitialState: function () {
      return this.getStateFromStores();
    },
    getStateFromStores: function () {
      return {
        deckID: this.getStore(DeckSliderStore).getDeckID(),
        next: this.getStore(DeckSliderStore).getNextSlide(),
        nextPath: this.getStore(DeckSliderStore).getNextSlide(),
        previous: this.getStore(DeckSliderStore).getPreviousSlide()
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    _getPrevPath: function() {
      return "/deck/"+ this.state.deckID +"/slide/" + this.state.previous.id;
    },
    _getNextPath: function() {
      return "/deck/"+ this.state.deckID +"/slide/" + this.state.next.id;
    },
     _onPrevClick: function(e) {
       this.props.context.executeAction(navigateAction, {path: this._getPrevPath()});
       e.preventDefault();
    },
     _onNextClick: function(e) {
       this.props.context.executeAction(navigateAction, {path: this._getNextPath()});
       e.preventDefault();
    },
    render: function() {
      var deckID=this.state.deckID;
      var prevElement="";
      if(this.state.previous){
        var prevPath=this._getPrevPath();
        prevElement=<a onClick={this._onPrevClick} ref="prevButton" href={prevPath} path={prevPath} title="previous"> <i className="chevron big circle left icon green"></i> </a>;
      }else{
        prevElement=<i className="chevron big circle left icon green disabled"></i>;
      }
      var nextElement="";
      if(this.state.next){
        var nextPath=this._getNextPath();
        nextElement=<a onClick={this._onNextClick} ref="nextButton" href={nextPath} title="next"> <i className="chevron big circle right icon green"></i> </a>;
      }else{
        nextElement=<i className="chevron big circle right icon green disabled"></i>;
      }

        return (
          <div className="sw-slide">
            <div className="ui segment">
              <h3> Slide {this.props.id} </h3>
              <h4 dangerouslySetInnerHTML={{__html: this.props.content.body}} />
              {prevElement}
              {nextElement}
            </div>
          </div>
        );
    }
});

module.exports = SlideView;
