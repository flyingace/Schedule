/* Created by davidcameron on 6/7/15. */

/*globals */

var _ = require('lodash');
var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');
var EventEmitter = require('events').EventEmitter;

// Define initial data points
var _employeeData = {}, _selectedEmployee = {}, _empListVisible = false;

function loadEmployeeData(data) {
    _employeeData = data;
}

function setSelectedEmployee(employeeID) {
    var _employee = {};

    for (var i = 0; i < _employeeData.length; i++) {
        _employee = _employeeData[i];

        if (_employee.employeeID === employeeID) {
            _selectedEmployee = _employee;
            return;
        }
    }
}

function _unsetSelectedEmployee() {
    _selectedEmployee = {};
}

function _assignShiftToEmployee(shift) {
    _selectedEmployee.assignedShifts.push(shift.shiftID);
    _selectedEmployee.assignedHours -= shift.shiftLength;
}

function _unassignShiftToEmployee(shift) {
    var _deselectedEmployee = shift.shiftAssignee;
    _deselectedEmployee.assignedShifts.pop(shift.shiftID);
    _deselectedEmployee.assignedHours += shift.shiftLength;
}

// Extend Cart Store with EventEmitter to add eventing capabilities
var EmployeeStore = _.extend({}, EventEmitter.prototype, {

        getEmployeeData: function () {
            return _employeeData;
        },

        getSelectedEmployee: function () {
            return _selectedEmployee;
        },

        assignShiftToEmployee: function (shift) {
            _assignShiftToEmployee(shift);
            _unsetSelectedEmployee();
        },

        unassignShiftToEmployee: function (shift) {
            _unassignShiftToEmployee(shift);
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

            // Respond to RECEIVE_DATA action
            case ScheduleConstants.RECEIVE_EMPLOYEE_DATA:
                loadEmployeeData(action.data);
                break;

            case ScheduleConstants.UPDATE_EMPLOYEE_SELECTION:
                setSelectedEmployee(action.employeeID);
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
    }
);

module.exports = EmployeeStore;
