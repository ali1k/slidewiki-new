'use strict';
var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
//stores
var DeckSliderStore = require('../stores/DeckSliderStore');

var DeckSlider = React.createClass({
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
        slides: this.getStore(DeckSliderStore).getSlides(),
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    render: function() {
        var slidesnumber=this.state.slides.length
        return (
          <div className="sw-deckslider-panel">
            <div className="panel">
              <div className="ui secondary top green attached segment">
                DeckSliderPanel
              </div>
              <div className="ui bottom attached segment">
                <h4> {this.props.cover.description} </h4>
                Slides Number: {slidesnumber}
              </div>
            </div>
          </div>
        );
    }
});

module.exports = DeckSlider;
