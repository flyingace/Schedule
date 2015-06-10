var ScheduleActions = require('../actions/ScheduleActions');

module.exports = {

    // Load mock schedule data from localStorage into ProductStore via Action
    getScheduleData: function() {
        var data = JSON.parse(localStorage.getItem('schedule'));
        ScheduleActions.receiveSchedule(data);
    }

};