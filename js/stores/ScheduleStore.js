/* Created by davidcameron on 6/7/15. */

/*globals */

var $ = require('jquery');
var _ = require('lodash');
var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');
var CalendarActions = require('../actions/CalendarActions');
var EmployeeActions = require('../actions/EmployeeActions');
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

function getEmpListPosition(targetShift) {
    var listPosition = {topPos: 0, leftPos: 0},
        shiftHeight;

    if (targetShift) {
        var $targetShift = $(targetShift);
        shiftHeight = $targetShift.height();
        listPosition.leftPos = $targetShift.position().left;
        listPosition.topPos = $targetShift.position().top + shiftHeight;
    }

    return listPosition;
}

function matchShiftAndEmployee() {
    var selectedShift = CalendarStore.getSelectedShift(),
        selectedEmployee = EmployeeStore.getSelectedEmployee();

    EmployeeStore.unassignShiftToEmployee(selectedShift);
    CalendarStore.assignEmployeeToShift(selectedEmployee);
    EmployeeStore.assignShiftToEmployee(selectedShift);
}

function scheduleEmployees() {
    var calendar = CalendarStore.getCalendarData(),
        employees = EmployeeStore.getEmployeeData();

    getCoverage(calendar, employees);
}

/*
 Proposed steps for auto-assign:
 1. Get number of weekend shifts (5 x full weekends)
 2. Get number of employees covering these shifts
 3. Max number of shifts any employee can be assigned is Math.ceil(weekend shifts/# of employees).
 4. Min number of shifts any employee will be assigned is Math.floor(weekend shifts/# of employees).

 Randomly assign weekend shifts. Try to spread them out.
 1. For each WE shift, loop through emps until all emps have minimum number of shifts, avoiding conflicts
 2. For each remaining WE shift randomly select employees, avoiding conflicts, avoiding clustering? No employees have more than max shifts
*/
function getCoverage (calendar, employees) {
    var weShifts = [],
        employeeCount = employees.length,
        minShifts,
        maxShifts;

    for (var i = 0; i < calendar.length; i++) {
        var shift = calendar[i];
        if (shift.dayName === 'Saturday' || shift.dayName == 'Sunday') {
            weShifts.push(shift);
        } else if (shift.dayName === 'Friday' && shift.shiftName === 'L&D Night') {
            weShifts.push(shift);
        }
    }

    assignWEShifts(weShifts, employees);

    console.log(calendar.length);
    console.log(weShifts.length);
}

function assignWEShifts(shiftArray, employees) {
    console.log(shiftArray);
    var allShiftIDs = _.pluck(shiftArray, 'shiftID');

    for (var i = 0; i < shiftArray.length; i++) {
        var emp = getEmployeeAtRandom(employees, allShiftIDs);
        CalendarActions.setSelectedShift(shiftArray[i]);
        EmployeeActions.setAssignedEmployee(emp.employeeID);
    }
}

//TODO: The math here means that this loop could go on forever, though it probably won't
//Perhaps try pushing that employee to the end of the shift and then adding 1 to a number to be subtracted from the
// length when a random number is being generated. When an employee is assigned, the random number is reset to 0,
// that way you always guarantee that the loop is finite
function getEmployeeAtRandom(employees, shiftIDArray) {
    //determine fewest shifts any employee has
    var fewestShifts = getFewestShiftsAssigned(employees, shiftIDArray),
        randomIndex, candidate, assignedCount, randomEmployee;
    //get employee at random
    while (!randomEmployee) {
        randomIndex = Math.floor(Math.random() * employees.length);
        candidate = employees[randomIndex];
        assignedCount = _.intersection(candidate.assignedShifts, shiftIDArray).length ;

        //TODO: Also a check for conflicts & assigned hours must be made
        if (assignedCount < fewestShifts + 1) {
            randomEmployee = candidate;
        }
    }

    return randomEmployee;
}

function getFewestShiftsAssigned(employees, shiftIDArray) {
    var fewest = 0,
        commonCount,
        empShiftsArray;

    for (var i = 0; i < employees.length; i++) {
        empShiftsArray = employees[i].assignedShifts;
        commonCount = _.intersection(empShiftsArray, shiftIDArray).length;
        fewest = (commonCount > fewest) ? commonCount : fewest;
    }

    return fewest;
}

function scheduleWeekends(calendar, employees) {

}

// Extend ScheduleStore with EventEmitter to add eventing capabilities
var ScheduleStore = _.extend({}, EventEmitter.prototype, {

    getEmpListStatus: function () {
        return _empListStatus;
    },

    getCoverage: function() {
        scheduleEmployees();
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
