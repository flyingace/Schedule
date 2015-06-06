/* Created by davidcameron on 6/5/15. */

/*globals */

window.React = require('react');
window.moment = require('./utils/moment');
var CalendarData = require('./CalendarData'),
    Schedule = require('./utils/Schedule'),
    CalendarApp = require('./components/Calendar.react');

// Load Mock Product Data into localStorage
CalendarData.init();

// Load Mock API Call
//CartAPI.getProductData();

// Render FluxCartApp Controller View
React.render(
    <CalendarApp />,
    document.getElementById('calendar_wrapper')
);