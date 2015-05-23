/* Created by davidcameron on 5/20/15. */

/*globals React */

/** @jsx React.DOM */

var Calendar = React.createClass({displayName: "Calendar",
    render: function () {
        return (
            React.createElement("div", {className: "calendar"})
        );
    }
});

React.render(
    React.createElement(Calendar, null),
    document.getElementById('calendar_wrapper')
);