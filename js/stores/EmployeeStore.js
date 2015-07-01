/* Created by davidcameron on 6/7/15. */

/*globals */

var _ = require('lodash');
var moment = require('moment');
var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');
var EventEmitter = require('events').EventEmitter;

// Define initial data points
var _employeeData = {}, _selectedEmployee = {}, _empListVisible = false;

function _loadEmployeeData(data) {
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

function setEmployeeAvailability(selectedShiftID) {
    for (var i = 0; i < _employeeData.length; i++) {

        var shiftsAssigned = _employeeData[i].assignedShifts,
            isAvailable = checkScheduleConflict(selectedShiftID, shiftsAssigned);

        _employeeData[i].available = isAvailable;
    }
}

//TODO: Fix this so consecutive night shifts are possible.
//TODO: Create method that resets all availability once a selection has been made
function checkScheduleConflict(shiftID, shifts) {
    var date = shiftID.slice(0,-3),
        dayAfter = moment(date).add(1, 'days').format('DDMMMMYYYY'),
        shiftsString = shifts.toString(),
        isAvailable = true;

    //checks conflict with other shifts on same day
    if (shiftsString.indexOf(date) !== -1) {
        isAvailable = false;
    }

    //checks conflict with night shift night before
    if (shiftID.indexOf('_LN') !== -1 && shiftsString.indexOf(dayAfter) !== -1) {
        isAvailable = false;
    }

    return isAvailable;
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
                _loadEmployeeData(action.data);
                break;

            case ScheduleConstants.UPDATE_EMPLOYEE_SELECTION:
                setSelectedEmployee(action.employeeID);
                break;

            // Respond to SHIFT_UNASSIGN action
            case ScheduleConstants.SHIFT_UNASSIGN:
                unassignShiftToEmployee(action.data);
                break;

            case ScheduleConstants.UPDATE_EMPLOYEE_AVAILABILITY:
                setEmployeeAvailability(action.shiftID);
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
