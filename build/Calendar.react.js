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
    React.createElement(Calendar, {monthName: "August", dayName: "Monday", shiftName: "LDPM"}),
    document.getElementById('calendar_wrapper')
);

/*
Start with a date range
Loop through each date
Date object contains Day, Month, Year, Day of Week
For each Month create a Month element
Render each Month
For each day in a month create a Day element
Extract Date and Day of Week from Date Object
Render each Day, Display Day of Week and Day of Month
For each Day of Week Determine Shifts
Render each shift

!!!
Start with Date Range
Create JSON object for All Months, Days, Shifts
 */