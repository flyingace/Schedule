var Dispatcher = require('flux').Dispatcher;

// Create dispatcher instance
var CalendarDispatcher = new Dispatcher();

// Convenience method to handle dispatch requests
CalendarDispatcher.handleAction = function(action) {
    this.dispatch({
        source: 'VIEW_ACTION',
        action: action
    });
};

module.exports = CalendarDispatcher;