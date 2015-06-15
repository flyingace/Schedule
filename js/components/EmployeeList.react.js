/* Created by davidcameron on 6/7/15. */

/*globals */

var React = require('react'),
    $ = require('jquery'),
    EmployeeData = require('../utils/Employees'),
    EmployeeActions = require('../actions/EmployeeActions'),
    EmployeeListItem = require('./EmployeeListItem.react')
    CalendarActions = require('../actions/CalendarActions');


var EmployeeMenu = React.createClass({

    displayName: EmployeeMenu,

    propTypes: {
        empListVisible: React.PropTypes.bool,
        employeeData: React.PropTypes.array
    },

    getDefaultProps: function () {
        return {
            empListVisible: false,
            employeeData: []
        };
    },

    getInitialState: function () {
        return null;
    },

    componentWillMount: function () {
    },

    componentDidMount: function () {
        $('.employee').on('click', this.onEmployeeSelected);
    },

    componentWillUnmount: function () {
    },

    render: function () {
        if (!this.props.employeeData.length)
        {
            return (
                <div>Calendar data loading...</div>
            );
        }

        return (
            <ul className = {'employee-list ' + (this.props.empListVisible ? 'visible' : '')} >
                <li className = "employee close">Close</li>
                {
                    this.props.employeeData.map(function (employee, index) {
                        return (
                            <EmployeeListItem key = {index} employeeName = {employee.name} totalHours = {employee.totalHours}
                                              availableHours = {employee.availableHours}/>
                        )
                    })
                }
                <li className = "employee">Unassigned</li>
            </ul>
        );
    },

    onEmployeeSelected: function (e) {
        EmployeeActions.updateListVisibility(false);
    }
});

module.exports = EmployeeMenu;