/* Created by davidcameron on 6/7/15. */

/*globals */

var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

// Define initial data points
var _calendarData = {}, _selected = null;

function loadCalendarData(data) {
    _calendarData = data;
}

function assignEmployeeToShift(data) {
    _selected = data[0].variants[0];
}

function unassignEmployeeToShift(index) {
    _selected = _product.variants[index];
}

// Extend CalendarStore with EventEmitter to add eventing capabilities
var CalendarStore = _.extend({}, EventEmitter.prototype, {

    // Return Product data
    getCalendarData: function() {
        return _calendarData;
    },

    // Return selected Product
    getSelected: function(){
        return _selected;
    },

    // Emit Change event
    emitChange: function() {
        this.emit('change');
    },

    // Add change listener
    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    // Remove change listener
    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }

});

// Register callback with ScheduleDispatcher
ScheduleDispatcher.register(function(payload) {
    var action = payload.action,
        text;

    switch (action.actionType) {

        // Respond to RECEIVE_CALENDAR_DATA action
        case ScheduleConstants.RECEIVE_CALENDAR_DATA:
            loadCalendarData(action.data);
            break;

        // Respond to SHIFT_ASSIGN action
        case ScheduleConstants.SHIFT_ASSIGN:
            assignEmployeeToShift(action.data);
            break;

        // Respond to SHIFT_UNASSIGN action
        case ScheduleConstants.SHIFT_UNASSIGN:
            unassignEmployeeToShift(action.data);
            break;

        default:
            return true;
    }

    // If action was responded to, emit change event
    CalendarStore.emitChange();

    return true;

});

module.exports = CalendarStore;