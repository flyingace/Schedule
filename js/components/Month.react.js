/* Created by davidcameron on 5/21/15. */

/*globals */

var React = require('react'),
    _ = require('lodash'),
    Day = require('./Day.react');

var Month = React.createClass({

    displayName: 'Month',

    propTypes: {},

    getDefaultProps: function () {

    },

    getInitialState: function () {
        return null;
    },

    componentWillMount: function () {
        this.createDayObjects(this.props.days);
    },

    componentWillReceiveProps: function (newProps) {
        this.createDayObjects(newProps.days);
    },

    createDayObjects: function (dayData, reshaped_data) {
        var dayID = dayData[0].dayID,
            dayName = dayData[0].dayName,
            dayDate = dayData[0].dayDate,
            reshapedData = reshaped_data || [],
            days;

        days = _.partition(dayData, function (shift) {
            return shift.dayID === dayID;
        }); //returns [[arrayA], [arrayB]]

        reshapedData[reshapedData.length] = {DayName: dayName, DayDate: dayDate, DayID: dayID, Shifts: days[0]};

        if (reshapedData.length > 32) {
            return;
        }

        if (days[1].length !== 0) {
            this.createDayObjects(days[1], reshapedData);
        } else {
            this.props.dayData = reshapedData;
        }
    },

    render: function () {
        return (
            <div className = 'month' data-id = {this.props.monthID}>
                <h1>{this.props.monthName}</h1>
                {
                    this.props.dayData.map(function (day, index) {
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
