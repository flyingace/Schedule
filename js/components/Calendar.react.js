/* Created by davidcameron on 5/20/15. */

/*globals */

var React = require('react'),
    _ = require('lodash'),
    Month = require('./Month.react');

var Calendar = React.createClass({

    displayName: 'Calendar',

    propTypes: {
        calendarData: React.PropTypes.array
    },

    getDefaultProps: function () {
        return {
            calendarData: []
        }
    },

    getInitialState: function () {
        return this.createMonthObjects(this.props.calendarData);
    },

    componentWillMount: function () {
    },

    componentDidMount: function () {
    },

    componentWillReceiveProps: function () {
        return this.createMonthObjects(this.props.calendarData);
    },

    componentWillUnmount: function () {
    },

    createMonthObjects: function (calendarData, specData) {
        var monthID = calendarData[0].dayID.slice(2),
            monthName = monthID.slice(0, -4),
            specialData = specData || [],
            oobj = {},
            months;

        months = _.partition(calendarData, function (shift) {
            return shift.dayID.slice(2, -4) === monthName;
        }); //returns [[arrayA], [arrayB]]

        specialData[specialData.length] = {MonthName: monthName, MonthID: monthID, Days_Shifts: months[0]};

        if (specialData.length > 5) {
            return;
        }

        if (months[1].length !== 0) {
            this.createMonthObjects(months[1], specialData);
            return;
        } else {
            oobj.monthData = specialData;
        }

        return oobj;

    },

    render: function () {

        if (!this.state.monthData.length) {
            return (
                <div className = "calendar">
                    No calendar yet!
                </div>
            )
        }

        return (
            <div className = "calendar">
                {
                    this.state.monthData.map(function (month, index) {
                        return (
                            <Month monthName = {month.MonthName} monthID = {month.monthID} key = {index} days = {month.Days_Shifts} />
                        )
                    })
                }
            </div>
        );
    }
});


//{ first: 'Christian' };
//
//this.setState({ last: [{
//
//}] });

module.exports = Calendar;
