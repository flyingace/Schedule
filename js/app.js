/* Created by davidcameron on 6/5/15. */

/*globals */

window.React = require('react');
//window.moment = require('./utils/moment');
var Schedule = require('./utils/Schedule'),
    Calendar = require('./components/Calendar.react'),
    EmployeeList = require('./components/EmployeeList.react');

// Load Mock Product Data into localStorage
//CalendarData.init();

// Load Mock API Call
//CartAPI.getProductData();

// Render FluxCartApp Controller View
React.render(
    <Calendar />,
    document.getElementById('calendar_wrapper')
);

React.render(
    <EmployeeList />,
    document.getElementById('employee-list')
);