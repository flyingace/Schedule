/* Created by davidcameron on 6/7/15. */

/*globals */

var _ = require('lodash');
var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');
var EventEmitter = require('events').EventEmitter;

// Define initial data points
var _employeeData = {}, _empListVisible = false;

function loadEmployeeData(data) {
    _employeeData = data;
}

function assignShiftToEmployee(shift) {
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
}

function unassignShiftToEmployee(index) {
    _selected = _product.variants[index];
}

// Extend Cart Store with EventEmitter to add eventing capabilities
var EmployeeStore = _.extend({}, EventEmitter.prototype, {

    getEmployeeData: function () {
        return _employeeData;
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
    var action = payload.action,
        text;

    switch (action.actionType) {

        // Respond to RECEIVE_DATA action
        case ScheduleConstants.RECEIVE_EMPLOYEE_DATA:
            loadEmployeeData(action.data);
            break;

        // Respond to SHIFT_ASSIGN action
        case ScheduleConstants.SHIFT_ASSIGN:
            assignShiftToEmployee(action.data);
            break;

        // Respond to SHIFT_UNASSIGN action
        case ScheduleConstants.SHIFT_UNASSIGN:
            unassignShiftToEmployee(action.data);
            break;

        default:
            return true;
    }

    // If action was responded to, emit change event
    EmployeeStore.emitChange();

    return true;

});

module.exports = EmployeeStore;