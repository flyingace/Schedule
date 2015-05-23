/* Created by davidcameron on 5/20/15. */

/*globals React */

/** @jsx React.DOM */

var Calendar = React.createClass({displayName: "Calendar",
    render: function () {
        return (
            React.createElement("div", {className: "calendar"}, 
                React.createElement(Month, null)
            )
        );
    }
});

React.render(
    React.createElement(Calendar, {monthName: "August", dayName: 'Monday', shiftName: 'LDPM'}),
    document.getElementById('calendar_wrapper')
);