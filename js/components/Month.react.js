/* Created by davidcameron on 5/21/15. */

/*globals */

var React = require('react');
var Day = require('./Day.react');

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
        var monthId = this.props.monthName.toLowerCase();

        return (
            <div className = 'month' id = {this.props.monthName.toLowerCase()}>
                <h1>{this.props.monthName}</h1>
                {
                    this.props.days.map(function (day, index) {
                        return (
                            <Day dayName = {day.DayName} dayDate = {day.DayDate} shifts = {day.Shifts} key = {index} />
                        )
                    })
                }
            </div>
        );
    }
});

module.exports = Month;
