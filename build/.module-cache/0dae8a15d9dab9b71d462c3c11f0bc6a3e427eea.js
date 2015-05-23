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

var Month = React.createClass({displayName: "Month",
    render: function () {
        return (
            React.createElement("div", {className: "month"}, 
                React.createElement("h1", null, this.props.monthName), 
                React.createElement(Day, null)
            )
        );
    }
});

var Day = React.createClass({displayName: "Day",
    render: function () {
        return (
            React.createElement("div", {className: "day"}, 
                React.createElement("h2", null, this.props.dayName), 
                React.createElement(Shift, null)
            )
        );
    }
});

var Shift = React.createClass({displayName: "Shift",
    render: function () {
        return (
            React.createElement("div", {className: "shift"}, React.createElement("p", null, this.props.shiftName))
        );
    }
});

React.render(
    React.createElement(Calendar, {monthName: "September", dayName: "Monday", shiftName: "LDPM"}),
    document.getElementById('calendar_wrapper')
);