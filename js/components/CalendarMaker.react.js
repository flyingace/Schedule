/* Created by davidcameron on 10/7/15. */

/*globals */

var React = require('react');

var CalendarMaker = React.createClass({

    displayName: CalendarMaker,

    propTypes: {},

    getDefaultProps: function () {
    },

    getInitialState: function () {
        return null;
    },

    componentDidMount: function () {
    },

    componentWillUnmount: function () {
    },

    render: function () {
        return (
            <div className = "class-name"></div>
        );
    }
});

module.exports = CalendarMaker;

React.render(
    <CalendarMaker />,
    document.getElementById('parent-id')
);