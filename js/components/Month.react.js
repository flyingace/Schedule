/* Created by davidcameron on 5/21/15. */

/*globals */

var React = require('react'),
    _ = require('lodash'),
    Day = require('./Day.react');

function createDayObjects(day_data) {
    var dayName, dayID, dayDate,
        reshapedDayData = [],
        days = [],
        dayData = day_data;

    while (!days[1] || days[1].length !== 0) {

        dayName = dayData[0].dayName;
        dayID = dayData[0].dayID;
        dayDate = dayData[0].dayDate;

        days = partitionDataByDay(dayData, dayID);

        reshapedDayData[reshapedDayData.length] = {DayName: dayName, DayDate: dayDate, DayID: dayID, Shifts: days[0]};

        dayData = days[1];
    }

    return {dayData: reshapedDayData};
}

function partitionDataByDay(dayData, dayID) {
    return _.partition(dayData, function (shift) {
        return shift.dayID === dayID;
    }); //returns [[arrayA], [arrayB]]
}


var Month = React.createClass({

    displayName: 'Month',

    propTypes: {},

    getDefaultProps: function () {

    },

    getInitialState: function () {
        return createDayObjects(this.props.days);
    },

    componentWillMount: function () {
        //this.createDayObjects(this.props.days);
    },

    componentWillReceiveProps: function (nextProps) {
        return createDayObjects(nextProps.days);
    },

    render: function () {

        return (
            <div className = 'month' data-id = {this.props.monthID}>
                <h1>{this.props.monthName}</h1>
                {
                    this.state.dayData.map(function (day, index) {
                        return (
                            <Day dayName = {day.DayName} dayDate = {day.DayDate} dayID = {day.DayID} key = {index} shifts = {day.Shifts}/>
                        )
                    })
                }
            </div>
        );
    }
});

module.exports = Month;
