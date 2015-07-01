/* Created by davidcameron on 5/21/15. */

/*globals */

var React = require('react'),
    CalendarActions = require('../actions/CalendarActions'),
    EmployeeActions = require('../actions/EmployeeActions');

var Shift = React.createClass({

    displayName: 'Shift',

    propTypes: {
        shiftAssignee: React.PropTypes.object,
        shiftAssigneeName: React.PropTypes.string.isRequired,
        shiftLength: React.PropTypes.number.isRequired,
        shiftName: React.PropTypes.string.isRequired,
        selected: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            shiftAssignee: {
                employeeName: 'Unassigned',
                employeeID: 'unassigned',
                committedHours: 0,
                assignedHours: 0,
                assignedShifts: []
            },
            shiftAssigneeName: 'Unassigned',
            shiftLength: 0,
            shiftName: 'Shift',
            selected: false
        }
    },

    componentWillMount: function () {
    },

    componentDidMount: function () {
    },

    getClassNameFromID: function (shiftID) {
        return " " + shiftID.substr(-2).toLowerCase();
    },

    onShiftClick: function (evt) {
        var targetShift = evt.currentTarget;

        CalendarActions.setSelectedShift(this.props.shiftID);
        EmployeeActions.updateAvailability(this.props.shiftID);
        EmployeeActions.updateListStatus(true, targetShift);
    },

    setClassesFromProps: function () {
        var className = "shift";

        className += this.getClassNameFromID(this.props.shiftID);

        if (this.props.shiftAssigneeName === 'Unassigned') {
            className += ' unassigned';
        }

        if (this.props.shiftSelected) {
            className += ' selected';
        }

        return className;
    },

    render: function () {
        return (
            <div className = {this.setClassesFromProps()} data-id = {this.props.shiftID}
                 onClick = {this.onShiftClick}>{this.props.shiftName}: {this.props.shiftAssigneeName}</div>
        );
    }
});

module.exports = Shift;