var CalendarActions = require('../actions/CalendarActions'),
    EmployeeActions = require('../actions/EmployeeActions');

module.exports = {

    // Load mock calendar data from localStorage into CalendarStore via Action
    getCalendarData: function () {
        var calData = JSON.parse(localStorage.getItem('calendar'));
        CalendarActions.receiveCalendarData(calData);
    },

    // Load mock employee data from localStorage into EmployeeStore via Action
    getEmployeeData: function () {
        var empData = JSON.parse(localStorage.getItem('employees'));
        EmployeeActions.receiveEmployeeData(empData);
    }

};