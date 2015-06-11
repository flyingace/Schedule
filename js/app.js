/* Created by davidcameron on 6/5/15. */

/*globals */

window.React = require('react');
var CalendarData = require('./CalendarData'),
    EmployeeData = require('./EmployeeData'),
    ScheduleAPI = require('./utils/ScheduleAPI'),
    ScheduleApp = require('./components/ScheduleApp.react');

// Load Mock Calendar Data into localStorage
CalendarData.init();
EmployeeData.init();

// Load Mock API Call
ScheduleAPI.getCalendarData();
ScheduleAPI.getEmployeeData();

// Render FluxCartApp Controller View
React.render(
    <ScheduleApp />,
    document.getElementById('schedule-wrapper')
);
