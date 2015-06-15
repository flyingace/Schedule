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

        return (
            <div className = 'month' data-id = {this.props.monthID} >
                <h1>{this.props.monthName}</h1>
                {
                    this.props.days.map(function (day, index) {
                        return (
                            <Day dayName = {day.DayName} dayDate = {day.DayDate} key = {index} shifts = {day.Shifts}  />
                        )
                    })
                }
            </div>
        );
    }
});

module.exports = Month;
