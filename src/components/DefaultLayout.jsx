'use strict';
var React = require('react');

/**
 * React class to handle the rendering of the HTML head section
 *
 * @class Head
 * @constructor
 */
var DefaultLayout = React.createClass({
    /**
     * Refer to React documentation render
     *
     * @method render
     * @return {Object} HTML head section
     */
    render: function() {
        return (
            <html>
            <head>
                <meta charSet="utf-8" />
                <title>{this.props.title}</title>
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <link href="/public/bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
                <link href="/public/css/bundle.css" rel="stylesheet" type="text/css" />
            </head>
            <body>
                  <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
            </body>
            <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
            <script src="/public/js/bundle.js" defer></script>
            </html>
        );
    }
});

module.exports = DefaultLayout;
