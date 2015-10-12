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

function checkScheduleConflict(shiftID, shifts) {
    var dayOfShift = shiftID.slice(0, (shiftID.indexOf('-'))),
        dayAfter = moment(dayOfShift, 'DDMMMMYYYY').add(1, 'days').format('DDMMMMYYYY'),
        dayBefore = moment(dayOfShift, 'DDMMMMYYYY').subtract(1, 'days').format('DDMMMMYYYY'),
        dayBeforeRegex = new RegExp('(' + dayBefore + ')[-\\d]+(-LN)'),
        dayAfterRegex = new RegExp('(' + dayAfter + ')[-\\d]+(-LN)'),
        shiftsArrayString = shifts.toString(),
        isAvailable = true,

        hasShiftOnSameDay = shiftsArrayString.match(dayOfShift),
        hasShiftOnNextDay = shiftsArrayString.match(dayAfter) &&
            dayAfterRegex.exec(shiftsArrayString) === null,
        hasNightShiftOnPreviousDay = dayBeforeRegex.exec(shiftsArrayString),
        selectedShiftIsNightShift = _.includes(shiftID, '-LN');

    //Conflict on Same Day
    //employee has another shift scheduled on the same day
    if (hasShiftOnSameDay) {
        return false;
    }

    //Conflict on Next Day
    //selected shift IS a Night Shift
    //and the employee has a shift scheduled on the next day that IS NOT a Night Shift
    if (selectedShiftIsNightShift && hasShiftOnNextDay) {
        return false;
    }

    //Conflict on Previous Day
    //selected shift IS NOT a Night Shift
    //and the employee has a shift scheduled on the previous day that IS a Night Shift
    if (!selectedShiftIsNightShift && hasNightShiftOnPreviousDay) {
        return false;
    }

    return isAvailable;
}

function setEmployeeAvailability(selectedShiftID) {
    for (var i = 0; i < _employeeData.length; i++) {

        var shiftsAssigned = _employeeData[i].assignedShifts,
            isAvailable = (_employeeData[i].employeeID === 'unassigned') ? true : checkScheduleConflict(selectedShiftID, shiftsAssigned);

        _employeeData[i].available = isAvailable;
    }
}

function _assignShiftToEmployee(shift) {
    _selectedEmployee.assignedShifts.push(shift.shiftID);
    _selectedEmployee.assignedHours -= shift.shiftLength;
}

function _unassignShiftToEmployee(shift) {
    var _deselectedEmployee = shift.shiftAssignee;
    if (_deselectedEmployee && _deselectedEmployee.assignedShifts) {
        _.pull(_deselectedEmployee.assignedShifts, shift.shiftID);
        _deselectedEmployee.assignedHours += shift.shiftLength;
    }
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
                _unassignShiftToEmployee(action.data);
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
