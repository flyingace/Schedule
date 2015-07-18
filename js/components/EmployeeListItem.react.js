/* Created by davidcameron on 6/7/15. */

/*globals */

var React = require('react');
var EmployeeActions = require('../actions/EmployeeActions');

var EmployeeListItem = React.createClass({

    displayName: EmployeeListItem,

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

    setClassesFromProps: function () {
        var className = "employee";

        if (this.props.isAvailable === false) {
            className += " unavailable";
        }

        return className;

    },

    onEmployeeAssign: function () {
        if (this.props.isAvailable === true) {
            EmployeeActions.setAssignedEmployee(this.props.employeeID);
        } else {
            alert('Are you sure? This employee has a scheduling conflict.')
        }
    },

    render: function () {
        return (
            <li className = {this.setClassesFromProps()}
                onClick = {this.onEmployeeAssign}>{this.props.employeeName}: {this.props.contractedHours}/{this.props.assignedHours}</li>
        );
    }
});

module.exports = EmployeeListItem;
