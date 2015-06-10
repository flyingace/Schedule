/* Created by davidcameron on 6/5/15. */

/*globals */

window.React = require('react');
var CalendarData = require('./CalendarData'),
    EmployeeData = require('./EmployeeData'),
    ScheduleApp = require('./components/ScheduleApp.react');

// Load Mock Calendar Data into localStorage
//CalendarData.init();

// Load Mock API Call
//CartAPI.getProductData();

// Render FluxCartApp Controller View
React.render(
    <ScheduleApp />,
    document.getElementById('scheduleApp')
);