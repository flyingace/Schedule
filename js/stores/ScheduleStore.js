/* Created by davidcameron on 6/7/15. */

/*globals */

var $ = require('jquery');
var _ = require('lodash');
var moment = require('moment');
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

    //getCoverage(calendar, employees);
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
    var weekendShifts = [],
        weekdayShifts = [];

    for (var i = 0; i < calendar.length; i++) {
        var shift = calendar[i];

        if (shift.dayName === 'Saturday' || shift.dayName === 'Sunday' ||
            (shift.dayName === 'Friday' && shift.shiftName === 'L&D Night')) {
            weekendShifts.push(shift);
        } else {
            weekdayShifts.push(shift);
        }
    }

    assignShifts(weekendShifts, employees);
    assignShifts(weekdayShifts, employees);

    console.log(calendar.length);
}

function assignShifts(shifts, employees) {
    var shiftIDs = _.pluck(shifts, 'shiftID'),
        emp;

    for (var i = 0; i < shifts.length; i++) {
        if (_.isEmpty(shifts[i].shiftAssignee)) {
            emp = getEmployee(employees, shiftIDs, shiftIDs[i]);
            CalendarActions.setSelectedShift(shiftIDs[i]);
            EmployeeActions.setAssignedEmployee(emp.employeeID);
        }
    }
}

function getEmployee(employees, shiftIDs, targetShift) {
    //make a copy of the array without the employee "Unassigned"
    var employeeArray = employees.slice(0, -1),
        employeeSet = employeeArray.length,
        //determine fewest shifts any employee has
        fewestShifts = getFewestShiftsAssigned(employeeArray, shiftIDs),
        randomIndex, candidate, assignedCount, employeeToAssign, hasNoConflicts;
    //get employee at random
    while (!employeeToAssign) {
        randomIndex = Math.floor(Math.random() * employeeSet);
        candidate = employeeArray[randomIndex];
        assignedCount = _.intersection(candidate.assignedShifts, shiftIDs).length;

        hasNoConflicts = checkForConflicts(candidate, targetShift);

        if (assignedCount < fewestShifts + 1 && hasNoConflicts) {
            employeeToAssign = candidate;
        } else {
            //remove the candidate from the array and then re-insert it at the end
            //then reduce employeeSet by 1 so the candidate won't be checked again
            _.pull(employeeArray, candidate);
            employeeArray.push(candidate);
            employeeSet--;

            if (employeeSet < 0) {
                alert("This thing aint workin'");
            }
        }
    }

    return employeeToAssign;
}

function getEmployeeAtRandom2(employees, shifts, targetShift) {
    //make a copy of the array without the employee "Unassigned"
    var employeeArray = employees.slice(0, -1),
        employeeSet = employeeArray.length,
    //compare ratio
        lowestRatio = getLowestRatio(employeeArray, shifts),
        randomIndex, candidate, assignedCount, randomEmployee, isAvailable;
    //get employee at random
    while (!randomEmployee) {
        randomIndex = Math.floor(Math.random() * employeeSet);
        candidate = employeeArray[randomIndex];
        assignedCount = _.intersection(candidate.assignedShifts, shifts).length;

        isAvailable = checkForConflicts(candidate, targetShift);

        if (assignedCount < lowestRatio + 1 && isAvailable) {
            randomEmployee = candidate;
        } else {
            //remove the candidate from the array and then re-insert it at the end
            //then reduce employeeSet by 1 so the candidate won't be checked again
            _.pull(employeeArray, candidate);
            employeeArray.push(candidate);
            employeeSet--;

            if (employeeSet < 0) {
                alert("This thing aint workin'");
            }
        }
    }

    return randomEmployee;
}

function lowestRatio(employeeArray, shifts) {

}

function checkForConflicts(candidate, targetShift) {
        var shiftID = targetShift,
            shifts = candidate.assignedShifts,
            dayOfShift = shiftID.slice(0, -3),
            dayAfter = moment(dayOfShift, 'DDMMMMYYYY').add(1, 'days').format('DDMMMMYYYY'),
            dayBefore = moment(dayOfShift, 'DDMMMMYYYY').subtract(1, 'days').format('DDMMMMYYYY'),
            shiftsString = shifts.toString(),
            isAvailable = true,

            hasShiftOnSameDay = _.contains(shiftsString, dayOfShift),
            hasConflictingShiftOnNextDay = _.contains(shiftsString, dayAfter) && !_.contains(shiftsString, dayAfter + '_LN'),
            hasNightShiftOnPreviousDay = _.contains(shiftsString, dayBefore + '_LN'),
            selectedShiftIsNightShift = _.contains(shiftID, '_LN'),
            selectedShiftIsNotNightShift = !selectedShiftIsNightShift;

        //Conflict on Same Day
        //employee has another shift scheduled on the same day
        if (hasShiftOnSameDay) {
            isAvailable = false;
        }

        //Conflict on Next Day
        //selected shift IS a Night Shift
        //and the employee has a shift scheduled on the next day that IS NOT a Night Shift
        if (selectedShiftIsNightShift && hasConflictingShiftOnNextDay) {
            isAvailable = false;
        }

        //Conflict on Previous Day
        //selected shift IS NOT a Night Shift
        //and the employee has a shift scheduled on the previous day that IS a Night Shift
        if (selectedShiftIsNotNightShift && hasNightShiftOnPreviousDay) {
            isAvailable = false;
        }

        return isAvailable;
}

function getFewestShiftsAssigned(employees, shiftIDArray) {
    var fewest = _.intersection(employees[0].assignedShifts, shiftIDArray).length,
        employeeAssignedShiftsLength,
        empShiftsArray;

    for (var i = 1; i < employees.length; i++) {
        empShiftsArray = employees[i].assignedShifts;
        employeeAssignedShiftsLength = _.intersection(empShiftsArray, shiftIDArray).length;
        fewest = (employeeAssignedShiftsLength < fewest) ? employeeAssignedShiftsLength : fewest;
    }

    return fewest;
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
