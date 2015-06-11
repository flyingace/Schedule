var Schedule = require('./utils/Schedule')

module.exports = {
    // Load Mock Product Data Into localStorage
    init: function () {
        var calendarData = Schedule.determineCalendar('05-01-2015', '07-31-2015');
        localStorage.removeItem('calendar');
        localStorage.setItem('calendar', JSON.stringify(calendarData));
    }
};
