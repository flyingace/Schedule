/* Created by davidcameron on 6/7/15. */

/*globals */

var React = require('react');
var CalendarStore = require('../stores/CalendarStore');
var EmployeeStore = require('../stores/EmployeeStore');
var ScheduleStore = require('../stores/ScheduleStore');
var Calendar = require('./Calendar.react');
var EmployeeList = require('./EmployeeList.react');
var Schedule = require('../utils/Schedule');

// Method to retrieve state from Stores
function getScheduleState() {
    return {
        calendarData: CalendarStore.getCalendarData(),
        employeeData: EmployeeStore.getEmployeeData(),
        employeeListStatus: ScheduleStore.getEmpListStatus()
    };
}

// Define main Controller View
var ScheduleApp = React.createClass({

    // Get initial state from stores
    getInitialState: function () {
        return getScheduleState();
    },

    // Add change listeners to stores
    componentDidMount: function () {
        //var calendarJSON = this._generateCalendarData();
        //this._setStateWithCalendarData(calendarJSON);
        EmployeeStore.addChangeListener(this._onChange);
        CalendarStore.addChangeListener(this._onChange);
        ScheduleStore.addChangeListener(this._onChange);
    },

    // Remove change listers from stores
    componentWillUnmount: function () {
        EmployeeStore.removeChangeListener(this._onChange);
        CalendarStore.removeChangeListener(this._onChange);
        ScheduleStore.removeChangeListener(this._onChange);
    },

    // Render our child components, passing state via props
    render: function () {
        return (
            <div className = "schedule-app">
                <Calendar calendarData = {this.state.calendarData}/>
                <EmployeeList employeeData = {this.state.employeeData} empListStatus = {this.state.employeeListStatus} />
            </div>
        );
    },

    // Method to setState based upon Store changes
    _onChange: function () {
        this.setState(getScheduleState());
    }
});

module.exports = ScheduleApp;