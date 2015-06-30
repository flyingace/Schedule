/* Created by davidcameron on 5/20/15. */

/*globals */

var React = require('react'),
    _ = require('lodash'),
    Month = require('./Month.react');

function createMonthObjects(calendarData) {
    var monthName, monthID,
        reshapedMonthData = [],
        months = [],
        calData = calendarData;

    while (!months[1] || months[1].length !== 0) {

        monthName = calData[0].monthName;
        monthID = calData[0].monthID;

        months = partitionDataByMonth(calData, monthID);

        reshapedMonthData[reshapedMonthData.length] = {MonthName: monthName, MonthID: monthID, Days_Shifts: months[0]};

        calData = months[1];
    }

    return {monthData: reshapedMonthData};
}

function partitionDataByMonth(calData, monthID) {
    return _.partition(calData, function (shift) {
        return shift.monthID === monthID;
    }); //returns [[arrayA], [arrayB]]
}

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
        return createMonthObjects(this.props.calendarData);
    },

    componentWillMount: function () {
    },

    componentDidMount: function () {
    },

    componentWillReceiveProps: function (nextProps) {
        return createMonthObjects(nextProps.calendarData);
    },

    componentWillUnmount: function () {
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
                            <Month monthName = {month.MonthName} monthID = {month.MonthID} key = {index}
                                   days = {month.Days_Shifts}/>
                        )
                    })
                }
            </div>
        );
    }
});

module.exports = Calendar;
