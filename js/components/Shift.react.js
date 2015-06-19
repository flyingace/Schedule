/* Created by davidcameron on 5/21/15. */

/*globals */

var React = require('react'),
    CalendarActions = require('../actions/CalendarActions'),
    EmployeeActions = require('../actions/EmployeeActions'),
    $ = require('jquery');

var Shift = React.createClass({

    displayName: 'Shift',

    propTypes: {
        shiftAssignee: React.PropTypes.string.isRequired,
        shiftLength: React.PropTypes.number.isRequired,
        shiftName: React.PropTypes.string.isRequired,
        selected: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            shiftAssignee: 'Unassigned',
            shiftLength: 0,
            shiftName: 'Shift',
            selected: false
        }
    },

    componentWillMount: function () {
    },

    componentDidMount: function () {
    },

    render: function () {
        return (
            <div className = {this.setClassesFromProps()} data-id = {this.props.shiftID} onClick = {this.onShiftClick}>{this.props.shiftName}: {this.props.shiftAssignee}</div>
        );
    },

    onShiftClick: function (evt) {
        var targetShift = $(evt.currentTarget);

        CalendarActions.setSelectedShift(this.props.shiftID);
        EmployeeActions.updateListStatus(true, targetShift);
    },

    setClassesFromProps: function () {
        var className = "shift";

        if (this.props.shiftAssignee === 'Unassigned') {
            className += ' unassigned';
        }

        if (this.props.shiftSelected) {
            className += ' selected';
        }

        return className;
    }
});

module.exports = Shift;