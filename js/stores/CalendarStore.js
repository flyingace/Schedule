/* Created by davidcameron on 6/7/15. */

/*globals */

var $ = require('jquery');
var _ = require('lodash');
var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');
var EventEmitter = require('events').EventEmitter;

// Define initial data points
var _calendarData = {}, _selectedShift, _employee = '';

function loadCalendarData(data) {
    _calendarData = data;
}

function setSelectedShift(shiftID) {
    var _days, _shifts, i, j, k;

    for (i = 0; i < _calendarData.length; i++) {
        _days = _calendarData[i].Days;
        for (j = 0; j < _days.length; j++) {
            _shifts = _days[j].Shifts;
            for (k = 0; k < _shifts.length; k++) {
                if (_shifts[k].shiftID === shiftID) {
                    _shifts[k].selected = true;
                    console.log(_shifts[k]);
                    return;
                }
            }
        }
    }

    //var getObject = function (container, id, callback) {
    //    _.each(container, function (item) {
    //        if (item.name === id) callback(item);
    //        if (item.tree) getObject(item.tree, id, callback);
    //    });
    //}
}

function assignEmployeeToShift(employee) {
    var _days, _shifts, i, j, k;

    for (i = 0; i < _calendarData.length; i++) {
        _days = _calendarData[i].Days;
        for (j = 0; j < _days.length; j++) {
            _shifts = _days[j].Shifts;
            for (k = 0; k < _shifts.length; k++) {
                if (_shifts[k].selected === true) {
                    _shifts[k].selected = false;
                    _shifts[k].shiftAssignee = employee;
                    return;
                }
            }
        }
    }

    var selectedShift = getSelectedShift();
    _employee = employee;
}

//TODO: Not sure if this is nec. for our purposes since
// employee assignment is only used for display at the moment
// and the only way to change this display would be to set a shift's
// assignment to "Unassigned."
function unassignEmployeeToShift(employee) {
    _employee = employee;
}

// Extend CalendarStore with EventEmitter to add eventing capabilities
var CalendarStore = _.extend({}, EventEmitter.prototype, {

    // Return Product data
    getCalendarData: function () {
        return _calendarData;
    },

    // Return selected Shift
    getSelectedShift: function () {
        return _selectedShift;
    },

    getAssignedEmployee: function () {
        return _employee;
    },

    // Emit Change event
    emitChange: function () {
        this.emit('change');
    },

    // Add change listener
    addChangeListener: function (callback) {
        this.on('change', callback);
    },

    // Remove change listener
    removeChangeListener: function (callback) {
        this.removeListener('change', callback);
    }

});

// Register callback with ScheduleDispatcher
ScheduleDispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.actionType) {

        // Respond to RECEIVE_CALENDAR_DATA action
        case ScheduleConstants.RECEIVE_CALENDAR_DATA:
            loadCalendarData(action.data);
            break;

        case ScheduleConstants.UPDATE_SHIFT_SELECTION:
            setSelectedShift(action.selectedShift);
            break;

        // Respond to SHIFT_ASSIGN action
        case ScheduleConstants.UPDATE_EMPLOYEE_ASSIGNMENT:
            assignEmployeeToShift(action.assignee);
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