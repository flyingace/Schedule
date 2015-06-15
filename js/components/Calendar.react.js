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