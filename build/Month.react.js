/* Created by davidcameron on 5/21/15. */

/*globals */

/** @jsx React.DOM */

var Month = React.createClass({

    displayName: 'Month',

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
            React.createElement("div", {className: "month"}, 
                React.createElement("h1", null, this.props.monthName), 
                
                    this.props.days.map(function (day, index) {
                        return (
                            React.createElement(Day, {dayName: day.DayName, dayDate: day.DayDate, shifts: day.Shifts, key: index})
                        )
                    })
                
            )
        );
    }
});
