/* Created by davidcameron on 5/20/15. */

/*globals */

var React = require('react');
var Month = require('./Month.react');

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

    componentDidMount: function () {
    },

    componentWillUnmount: function () {
    },

    render: function () {

        if (!this.props.calendarData.length) {
            return (
                <div className = "calendar">
                    No calendar yet!
                </div>
            )
        }

        return (
            <div className = "calendar">
                {
                    this.props.calendarData.map(function (month, index) {
                        return (
                            <Month monthName = {month.MonthName} monthID = {month.monthID} key = {index} days = {month.Days} />
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