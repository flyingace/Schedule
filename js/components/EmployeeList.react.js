/* Created by davidcameron on 6/7/15. */

/*globals */

var React = require('react'),
    $ = require('jquery'),
    EmployeeData = require('../utils/Employees'),
    EmployeeActions = require('../actions/EmployeeActions'),
    EmployeeListItem = require('./EmployeeListItem.react')
    CalendarActions = require('../actions/CalendarActions');


var EmployeeList = React.createClass({

    displayName: EmployeeList,

    propTypes: {
        empListStatus: React.PropTypes.object,
        employeeData: React.PropTypes.array
    },

    getDefaultProps: function () {
        return {
            empListStatus: {isVisible: false, topPos: 0, leftPos: 0},
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
        var listPosition = {top: this.props.empListStatus.topPos, left: this.props.empListStatus.leftPos};

        if (!this.props.employeeData.length)
        {
            return (
                <div>Calendar data loading...</div>
            );
        }

        return (
            <ul className = {'employee-list ' + (this.props.empListStatus.isVisible ? 'visible' : '')} style = {listPosition} >
                <li className = "employee close">Close</li>
                {
                    this.props.employeeData.map(function (employee, index) {
                        return (
                            <EmployeeListItem key = {index} employeeName = {employee.employeeName} employeeID = {employee.employeeID} committedHours = {employee.committedHours}
                                              assignedHours = {employee.assignedHours}/>
                        )
                    })
                }
            </ul>
        );
    },

    onEmployeeSelected: function (e) {
        EmployeeActions.updateListStatus(false, null);
    }
});

module.exports = EmployeeList;
