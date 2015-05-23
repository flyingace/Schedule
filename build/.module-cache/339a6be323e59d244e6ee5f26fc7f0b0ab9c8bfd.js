/* Created by davidcameron on 5/20/15. */

/*globals React */

/** @jsx React.DOM */

var Calendar = React.createClass({displayName: "Calendar",
    render: function () {
        return (
            React.createElement("div", {className: "calendar"}, 
                React.createElement(Month, {monthName: "August"}, 
                    React.createElement(Day, {dayName: "Monday"}, 
                        React.createElement(Shift, {shiftName: "L & D PM"})
                    )
                )
            )
        );
    }
});

React.render(
    React.createElement(Calendar, null),
    document.getElementById('calendar_wrapper')
);