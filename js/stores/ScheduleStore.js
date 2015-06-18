/* Created by davidcameron on 6/7/15. */

/*globals */

var $ = require('jquery');
var _ = require('lodash');
var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');
var EventEmitter = require('events').EventEmitter;

// Define initial data points
var _selectedShiftId, _selectedEmployeeId, _empListIsVisible;

function setSelectedShiftId(shiftID) {
    _selectedShiftId = shiftID;
    console.log(_selectedShiftId);
}

function setSelectedEmployeeName(employeeName) {
    _selectedEmployeeName = employeeName;
}

function setSelectedEmployeeId(employeeId) {
    _selectedEmployeeId = employeeId;
}

// Set cart visibility
function setEmpListVisibility(empListIsVisible) {
    _empListIsVisible = empListIsVisible;
}


// Extend ScheduleStore with EventEmitter to add eventing capabilities
var ScheduleStore = _.extend({}, EventEmitter.prototype, {

    // Return selected Shift
    getSelectedShiftId: function () {
        return _selectedShiftId;
    },

    // Return selected Shift
    getSelectedEmployeeId: function () {
        return _selectedEmployeeId;
    },

    getEmpListVisibility: function () {
        return _empListIsVisible;
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

        case ScheduleConstants.UPDATE_SHIFT_SELECTION:
            setSelectedShiftId(action.shiftID);
            break;

        case ScheduleConstants.UPDATE_EMPLOYEE_SELECTION:
            setSelectedEmployeeName(action.employeeName);
            setSelectedEmployeeId(action.employeeID);
            break;

        // Respond to SHIFT_ASSIGN action
        case ScheduleConstants.UPDATE_LIST_VISIBILITY:
            setEmpListVisibility(action.empListIsVisible);
            break;

        // Respond to SHIFT_UNASSIGN action
        case ScheduleConstants.SHIFT_UNASSIGN:
            unassignEmployeeToShift(action.data);
            break;

        default:
            return true;
    }

    // If action was responded to, emit change event
    ScheduleStore.emitChange();

    return true;

});

module.exports = ScheduleStore;