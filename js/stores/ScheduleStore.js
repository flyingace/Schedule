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

    //debugger;
    getShiftCoverage(calendar, employees);
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
function getShiftCoverage(calendar, employees) {
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
    assignShifts(weekendShifts, employees, 'weekend');
    assignShifts(weekdayShifts, employees, 'weekday');

    console.log(calendar.length);
}

function assignShifts(shifts, employees, shiftType) {
    var shiftIDs = _.pluck(shifts, 'shiftID'),
        getEmployee = (shiftType === 'weekend') ? getWeekendEmployee : getWeekdayEmployee,
        //make a copy of the array without the employee "Unassigned"
        employeeArray = employees.slice(0, -1),
        emp;

    for (var i = 0; i < shifts.length; i++) {
        if (_.isEmpty(shifts[i].shiftAssignee)) {

            emp = getEmployee(employeeArray, shiftIDs, shiftIDs[i]);
            CalendarActions.setSelectedShift(shiftIDs[i]);
            EmployeeActions.setAssignedEmployee(emp.employeeID);
        }
    }
}

function getWeekendEmployee(employeeArray, shiftIDs, targetShift) {
    var employeeSet = employeeArray.length,
    //determine fewest shifts any employee has
        fewestShifts = getFewestShiftsAssigned(employeeArray, shiftIDs),
        randomIndex, candidate, assignedCount, employeeToAssign;

    //get employee at random
    while (!employeeToAssign) {
        randomIndex = Math.floor(Math.random() * employeeSet);
        candidate = employeeArray[randomIndex];
        assignedCount = _.intersection(candidate.assignedShifts, shiftIDs).length;

        //Does the candidate have any conflicts & do they match the lowest number of shifts?
        //TODO: run assignedCount & fewestShifts as functions here so time isn't taken to define them if the first
        // condition (employeeHasConflict) is true
        if (employeeHasConflict(candidate, targetShift) || (assignedCount >= fewestShifts + 1)) {
            adjustEmployeeArray(employeeArray, employeeSet, candidate);
        } else {
            employeeToAssign = candidate;
        }
    }

    return employeeToAssign;
}

function getWeekdayEmployee(employeeArray, shifts, targetShift) {

    var employeeSet = employeeArray.length;

    for (var i = 0; i < employeeArray.length; i++) {
        var employee = employeeArray[i];
        for (var j = 0; j < employee.assignedShifts.length; j++) {
            var idArray = employee.assignedShifts[j].split('-');
            if (idArray[1] === targetShift.split('-')[1]) {
                employee.thisWeeksShifts.push(employee.assignedShifts[j]);
            }
        }
    }

    debugger;


    //compare ratio
        lowestRatio, randomIndex, candidate, assignedCount, randomEmployee, hasNoConflicts;

        lowestRatio = getLowestRatio(employeeArray, shifts);

    //get employee at random
    while (!randomEmployee) {
        randomIndex = Math.floor(Math.random() * employeeSet);
        candidate = employeeArray[randomIndex];

        //Does the candidate have any conflicts and are they out of available hours?
        if (employeeHasConflict(candidate, targetShift) || isNotAvailable(candidate, targetShift)) {
            adjustEmployeeArray(employeeArray, employeeSet, candidate);
        } else {
            randomEmployee = candidate;
        }
    }

    return randomEmployee;
}
/*
 By week, in order, select a shift
 Randomly choose an employee
 Has that employee exceeded the ACCEPTABLE LIMIT
 Yes, assign shift
 No, adjust array as done with weekend shifts
 Start employee check again

 When is an employee's weekly commitment adjusted?
 At start of week?
 How is this done?
 Their hours assigned vs. hours contracted is checked and hours contracted for the coming week is adjusted

 How is ACCEPTABLE LIMIT determined?
 For each week need is compared to availability. The difference is used to adjust the calculation of each employee's
 contracted hours

 */

function adjustEmployeeArray(employeeArray, employeeSet, candidate) {
    //remove the candidate from the array and then re-insert it at the end
    //then reduce employeeSet by 1 so the candidate won't be checked again
    _.pull(employeeArray, candidate);
    employeeArray.push(candidate);
    employeeSet--;

    if (employeeSet < 0) {
        alert("This thing aint workin'");
    }
}

function getLowestRatio(employeeArray, shifts) {
    /*
     Find all shifts for this week
     How many of hours of these shifts has each employee taken
     How does that compare to the number of hours they were contracted for?
     What is the lowest ratio of hours assigned/hours contracted?
     */

}

function employeeHasConflict(candidate, targetShift) {
    var shiftID = targetShift,
        shifts = candidate.assignedShifts,
        dayOfShift = shiftID.slice(0, -3),
        dayAfter = moment(dayOfShift, 'DDMMMMYYYY').add(1, 'days').format('DDMMMMYYYY'),
        dayBefore = moment(dayOfShift, 'DDMMMMYYYY').subtract(1, 'days').format('DDMMMMYYYY'),
        shiftsString = shifts.toString(),
        hasConflicts = false,

        hasShiftOnSameDay = _.contains(shiftsString, dayOfShift),
        hasConflictingShiftOnNextDay = _.contains(shiftsString, dayAfter) && !_.contains(shiftsString, dayAfter + '_LN'),
        hasNightShiftOnPreviousDay = _.contains(shiftsString, dayBefore + '_LN'),
        selectedShiftIsNightShift = _.contains(shiftID, '_LN'),
        selectedShiftIsNotNightShift = !selectedShiftIsNightShift;

    //Conflict on Same Day
    //employee has another shift scheduled on the same day
    if (hasShiftOnSameDay) {
        hasConflicts = true;
    }

    //Conflict on Next Day
    //selected shift IS a Night Shift
    //and the employee has a shift scheduled on the next day that IS NOT a Night Shift
    if (selectedShiftIsNightShift && hasConflictingShiftOnNextDay) {
        hasConflicts = true;
    }

    //Conflict on Previous Day
    //selected shift IS NOT a Night Shift
    //and the employee has a shift scheduled on the previous day that IS a Night Shift
    if (selectedShiftIsNotNightShift && hasNightShiftOnPreviousDay) {
        hasConflicts = true;
    }

    return hasConflicts;
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

function isNotAvailable(candidate, targetShift) {
    return !!Math.round(Math.random());
    //return true;
}


// Extend ScheduleStore with EventEmitter to add eventing capabilities
var ScheduleStore = _.extend({}, EventEmitter.prototype, {

    getEmpListStatus: function () {
        return _empListStatus;
    },

    getCoverage: function () {
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
