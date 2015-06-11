var Dispatcher = require('flux').Dispatcher;

// Create dispatcher instance
var ScheduleDispatcher = new Dispatcher();

// Convenience method to handle dispatch requests
ScheduleDispatcher.handleAction = function(action) {
    this.dispatch({
        source: 'VIEW_ACTION',
        action: action
    });
};

module.exports = ScheduleDispatcher;