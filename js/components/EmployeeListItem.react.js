/* Created by davidcameron on 6/7/15. */

/*globals */

var React = require('react');
var CalendarActions = require('../actions/CalendarActions');

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
      CalendarActions.assignEmployee(this.props.employeeName)
    },

    render: function () {
        return (
            <li className = "employee" onClick = {this.onEmployeeAssign}>{this.props.employeeName}: {this.props.totalHours}/{this.props.availableHours}</li>
        );
    }
});

module.exports = EmployeeListItem;