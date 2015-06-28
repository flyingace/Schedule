/* Created by davidcameron on 6/7/15. */

/*globals module*/

var _ = require('lodash');
var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');
var EventEmitter = require('events').EventEmitter;

// Define initial data points
var _calendarData = {}, _selectedShift = {};

function loadCalendarData(data) {
    _calendarData = data;
}

function _setSelectedShift(shiftID) {
    var _shift;

    _unsetSelectedShift();

    if (shiftID) {
        for (var i = 0; i < _calendarData.length; i++) {
            _shift = _calendarData[i];
            if (_shift.shiftID === shiftID) {
                _shift.selected = true;

                _selectedShift = _shift;
                return;
            }
        }
    }
}

function _unsetSelectedShift() {
    _selectedShift.selected = false;
    _selectedShift = {};
}

function _assignEmployeeToShift(employee) {
    _selectedShift.shiftAssignee = employee;
    _selectedShift.shiftAssigneeName = employee.employeeName;
    _selectedShift.shiftAssigneeID = employee.employeeID;
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

        assignEmployeeToShift: function (employee) {
            _assignEmployeeToShift(employee);
            _unsetSelectedShift();
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

    }
);

// Register callback with ScheduleDispatcher
ScheduleDispatcher.register(function (payload) {
        var action = payload.action;

        switch (action.actionType) {

            // Respond to RECEIVE_CALENDAR_DATA action
            case ScheduleConstants.RECEIVE_CALENDAR_DATA:
                loadCalendarData(action.data);
                break;

            case ScheduleConstants.UPDATE_SHIFT_SELECTION:
                _setSelectedShift(action.shiftID);
                break;

            default:
                return true;
        }

        // If action was responded to, emit change event
        CalendarStore.emitChange();

        return true;
    }
);

module.exports = CalendarStore;
