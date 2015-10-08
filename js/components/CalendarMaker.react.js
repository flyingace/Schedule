/* Created by davidcameron on 10/7/15. */

/*globals */

var React = require('react'),
    DatePicker = require('react-datepicker'),
    moment = require('../utils/moment');

var CalendarMaker = React.createClass({

    displayName: CalendarMaker,

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
            <div className = "date-picker">
                <DatePicker
                    selected = {moment()}
                    onChange = {this.handleChange}/>
            </div>
        );
    }
});

module.exports = CalendarMaker;