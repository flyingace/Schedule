/* Created by davidcameron on 6/7/15. */

/*globals */

var _ = require('lodash');
var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');
var EventEmitter = require('events').EventEmitter;

// Define initial data points
var _employeeData = {}, _empListVisible = false, _selectedEmployeeID;

function loadEmployeeData(data) {
    _employeeData = data;
}

function setSelectedEmployeeID(employeeID) {
    _selectedEmployeeID = employeeID;
}

function updateSelectedEmployee(employeeID) {

}

function unassignShiftToEmployee(index) {
    _selected = _product.variants[index];
}

// Extend Cart Store with EventEmitter to add eventing capabilities
var EmployeeStore = _.extend({}, EventEmitter.prototype, {

        getEmployeeData: function () {
            return _employeeData;
        },

        getSelectedEmployeeID: function () {
            return _selectedEmployeeID;
        },

        getSelectedEmployee: function (employeeID) {
            var _selectedEmployee = {},
                _employee = {},
                i;

            for (i = 0; i < _employeeData.length; i++) {
                _employee = _employeeData[i];

                if (_employee.employeeID === employeeID) {
                    _selectedEmployee = _employee;
                }
            }

            return _selectedEmployee
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
        var action = payload.action,
            text;

        switch (action.actionType) {

            // Respond to RECEIVE_DATA action
            case ScheduleConstants.RECEIVE_EMPLOYEE_DATA:
                loadEmployeeData(action.data);
                break;

            //case ScheduleConstants.UPDATE_EMPLOYEE_SELECTION:
            //    assignShiftToEmployee(action.employeeID);
            //    break;

            // Respond to SHIFT_ASSIGN action
            //case ScheduleConstants.SHIFT_ASSIGN:
            //    assignShiftToEmployee(action.data);
            //    break;

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
