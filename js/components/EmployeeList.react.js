/* Created by davidcameron on 6/7/15. */

/*globals */

var React = require('react');
var EmployeeData = require('../utils/Employees');
var EmployeeListItem = require('./EmployeeListItem.react');

var EmployeeMenu = React.createClass({

    displayName: EmployeeMenu,

    propTypes: {},

    getDefaultProps: function () {
        return null;
    },

    getInitialState: function () {
        return {
            empListVisible: false,
            employeeData: {}
        };
    },

    componentDidMount: function () {
    },

    componentWillUnmount: function () {
    },

    render: function () {
        if (!this.props.employeeData.length)
        {
            return (<div>Howdy!</div>);
        }

        return (
            <ul className = {'employee-list ' + (this.props.empListVisible ? 'visible' : '')} >
                <li className = "employee close">Close</li>
                {
                    this.props.employeeData.map(function (employee, index) {
                        return (
                            <EmployeeListItem employeeName = {employee.name} totalHours = {employee.totalHours}
                                              availableHours = {employee.availableHours}/>
                        )
                    })
                }
                <li className = "employee">Unassigned</li>
            </ul>
        );
    }
});

module.exports = EmployeeMenu;