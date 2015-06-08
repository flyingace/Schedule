/* Created by davidcameron on 6/7/15. */

/*globals */

var React = require('react');

var EmployeeMenuItem = React.createClass({

    displayName: EmployeeMenuItem,

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
            <li className = "employee">{this.props.employeeName}: {this.props.totalHours}/{this.props.availableHours}</li>
        );
    }
});

module.exports = EmployeeMenuItem;