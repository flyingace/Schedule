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
        return null;
    },

    componentWillMount: function () {
        console.log('will mount');
        this.createMonthObjects(this.props.calendarData);
    },

    componentDidMount: function () {
        console.log(this.props);
    },

    componentWillUnmount: function () {
    },

    createMonthObjects: function (calendarData, specData) {
        var monthID = calendarData[0].dayID.slice(2),
            monthName = monthID.slice(0, -4),
            specialData = specData || [];

        months = _.partition(calendarData, function (shift) {
            return shift.dayID.slice(2, -4) === monthName;
        }); //returns [[arrayA], [arrayB]]

        specialData[specialData.length] = {MonthName: monthName, MonthID: monthID, Days_Shifts: months[0]};

        console.log(specialData);
        if (specialData.length > 5) {
            return;
        }

        if (months[1].length !== 0) {
            this.createMonthObjects(months[1], specialData);
        } else {
            this.props.revCalData = specialData;
        }
    },

    /*
    Take first item in array
    Does it have the same monthName as monthName?
    Yes: Add it to the matching monthName array
    No: Create a new monthname array for the new monthname
     */

    render: function () {

        if (!this.props.revCalData.length) {
            return (
                <div className = "calendar">
                    No calendar yet!
                </div>
            )
        }

        return (
            <div className = "calendar">
                {
                    this.props.revCalData.map(function (month, index) {
                        return (
                            <Month monthName = {month.MonthName} monthID = {month.monthID} key = {index} days = {month.Days_Shifts} />
                        )
                    })
                }
            </div>
        );
    }
});

module.exports = Calendar;

/*
var path, current_month, current_day;

this.props.calendarData.map(function (shift, index) {
    if (shift.monthName !== current_month) {
        current_month = shift.monthName;
        //append dom with div with id related to current_month
    }

    if (shift.dayName !== current_day) {
        current_day = shift.dayName;
        //append dom with div with id related to current_day
    }

    path = $(#current_month).find(#current_day);
    path.append(<Shift shiftName = {shift.ShiftName} shiftID = {shift.shiftID}, etc.
}

Continue to create Month, Day and Shift objects by starting with the initial this.props.calendarData and first
 filtering out all Days in the same month and creating a new Month with that, setting the MonthName and MonthID
  values to the first values for the month. Pass in all the matching shifts and do the same with Days.

  The crucial part of this is creating sub-sets of the data on the fly. Remember, this doesn't alter the shape of
   the original data, it's only for rendering, and every time that the original data is updated this whole process will
   recur.

 */