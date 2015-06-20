/* Created by davidcameron on 6/7/15. */

/*globals */

var $ = require('jquery');
var _ = require('lodash');
var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');
var CalendarStore = require('./CalendarStore');
var EmployeeStore = require('./EmployeeStore');
var EventEmitter = require('events').EventEmitter;

// Define initial data points
var _selectedShiftId, _selectedEmployeeId, _empListStatus;

//function setSelectedShiftId(shiftID) {
//    _selectedShiftId = shiftID;
//}
// Set cart visibility
function setEmpListStatus(empListIsVisible, targetShift) {
    var empListPosition = getEmpListPosition(targetShift);

    _empListStatus = {};
    _empListStatus.isVisible = empListIsVisible;
    _empListStatus.topPos = empListPosition.topPos;
    _empListStatus.leftPos = empListPosition.leftPos;
}

function getEmpListPosition($targetShift) {
    var listPosition = {topPos: 0, leftPos: 0},
        shiftWidth, shiftHeight, shiftPosition, topPos, leftPos;

    if ($targetShift) {
        shiftWidth = $targetShift.width();
        shiftHeight = $targetShift.height();
        listPosition.leftPos = $targetShift.position().left; // + shiftWidth;
        listPosition.topPos = $targetShift.position().top + shiftHeight;
    }

    return listPosition;
}

function matchShiftAndEmployee() {
    var selectedShift = CalendarStore.getSelectedShift(),
        selectedEmployee = EmployeeStore.getSelectedEmployee();

    CalendarStore.assignEmployeeToShift(selectedEmployee);
    EmployeeStore.assignShiftToEmployee(selectedShift);
}

// Extend ScheduleStore with EventEmitter to add eventing capabilities
var ScheduleStore = _.extend({}, EventEmitter.prototype, {

    getEmpListStatus: function () {
        return _empListStatus;
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

        //case ScheduleConstants.UPDATE_SHIFT_SELECTION:
        //    setSelectedShiftId(action.shiftID);
        //    break;

        case ScheduleConstants.UPDATE_EMPLOYEE_SELECTION:
            matchShiftAndEmployee();
            break;

        // Respond to SHIFT_ASSIGN action
        case ScheduleConstants.UPDATE_LIST_VISIBILITY:
            setEmpListStatus(action.empListIsVisible, action.targetShift);
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
