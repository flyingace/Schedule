/* Created by davidcameron on 5/20/15. */

/*globals */

var React = require('react');
var Schedule = require('../utils/Schedule');
var Month = require('./Month.react');

var Calendar = React.createClass({

    displayName: 'Calendar',

    propTypes: {
        calendarData: React.PropTypes.object
    },

    getDefaultProps: function () {

    },

    getInitialState: function () {
        return {
            calendarData: {}
        }
    },

    componentDidMount: function () {
        var calendarJSON = this._generateCalendarData();
        this._setStateWithCalendarData(calendarJSON);
    },

    componentWillUnmount: function () {
    },

    render: function () {

        if (!this.state.calendarData.length) {
            return (
                <div className = "calendar">
                    No calendar yet!
                </div>
            )
        }

        return (
            <div className = "calendar">
                {
                    this.state.calendarData.map(function (month, index) {
                        return (
                            <Month monthName = {month.MonthName} days = {month.Days} key = {index}/>
                        )
                    })
                }
            </div>
        );
    },

    _generateCalendarData: function () {
        return Schedule.determineCalendar('05-01-2015', '07-31-2015');
    },

    _setStateWithCalendarData: function (calendarJSON) {
            this.setState({
                calendarData: calendarJSON
            });
    }
});

module.exports = Calendar;