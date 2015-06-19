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

    onEmployeeAssign: function () {
      EmployeeActions.setAssignedEmployee(this.props.employeeName, this.props.employeeID);
    },

    render: function () {
        return (
            <li className = "employee" onClick = {this.onEmployeeAssign}>{this.props.employeeName}: {this.props.committedHours}/{this.props.assignedHours}</li>
        );
    }
});

module.exports = EmployeeListItem;
