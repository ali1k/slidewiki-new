'use strict';
var React = require('react');

var DeckNewsFeed = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {


        return (
          <div className="sw-deck-newsfeed">
            <div className="panel">
              <div className="ui secondary top green attached segment">
                Deck News Feed
              </div>
              <div className="ui bottom attached segment">

              <div className="ui feed">
                <div className="event">
                  <div className="label">
                    <img src="http://semantic-ui.com/images/avatar/small/helen.jpg" />
                  </div>
                  <div className="content">
                    <div className="summary">
                      <a className="user">
                      Alice King
                      </a> subscribed to this deck
                      <div className="date">
                      1 Hour Ago
                      </div>
                    </div>
                    <div className="meta">
                      <a className="like">
                        <i className="like icon"></i> 4 Likes
                      </a>
                    </div>
                  </div>
                </div>
                <div className="event">
                  <div className="label">
                  <i className="pencil icon"></i>
                  </div>
                  <div className="content">
                    <div className="summary">
                    You edited a question on this deck
                    <div className="date">
                    3 days ago
                    </div>
                  </div>
                  <div className="extra text">
                    What is Semantic Web?
                  </div>
                  <div className="meta">
                    <a className="like">
                      <i className="like icon"></i> 11 Likes
                    </a>
                  </div>
                  </div>
                </div>

                <div className="event">
                  <div className="label">
                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg"/>
                    </div>
                    <div className="content">
                    <div className="date">
                    4 days ago
                    </div>
                    <div className="summary">
                    <a>Bob Ray</a> added <a>2 new slides</a>
                    </div>
                    <div className="extra images">
                    <a><img src="http://semantic-ui.com/images/wireframe/image.png"/></a>
                    <a><img src="http://semantic-ui.com/images/wireframe/image.png"/></a>
                    </div>
                    <div className="meta">
                    <a className="like">
                    <i className="like icon"></i> 1 Like
                    </a>
                    </div>
                    </div>
                </div>

              </div>

              </div>

            </div>
          </div>
        );
    }
});

module.exports = DeckNewsFeed;
