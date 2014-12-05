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
              <div className="ui attached segment">
              <h4 dangerouslySetInnerHTML={{__html: this.props.cover.description}} />
              </div>
              <div className="ui secondary bottom attached segment center aligned">
                <div className="bottom attached compact ui icon buttons">
                  <div className="ui button"><i className="icon step backward"></i></div>
                  <div className="ui button"><i className="icon caret left"></i></div>
                  <div className="ui blue button">0/{slidesnumber}</div>
                  <div className="ui button"><i className="icon caret right"></i></div>
                  <div className="ui button"><i className="icon step forward"></i></div>
                  <div className="ui teal button"><i className="icon maximize"></i></div>
                </div>
              </div>
            </div>
          </div>
        );
    }
});

module.exports = DeckSlider;
