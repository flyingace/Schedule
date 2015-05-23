/* Created by davidcameron on 5/20/15. */

/*globals React */

/** @jsx React.DOM */

var Calendar = React.createClass({displayName: "Calendar",
    render: function () {

        return (
            React.createElement("div", {className: "calendar"}, 
                React.createElement(Month, {monthName: this.props.monthName}, 
                    React.createElement(Day, {dayName: this.props.dayName}, 
                        React.createElement(Shift, {shiftName: this.props.shiftName})
                    )
                )
            )
        );
    }
});

React.render(
    React.createElement(Calendar, {monthName: "September", dayName: "Monday", shiftName: "LDPM"}),
    document.getElementById('calendar_wrapper')
);