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
        weekdayShifts = [],
        //make a copy of the array without the employee "Unassigned"
        employeeArray = employees.slice(0, -1);

    for (var i = 0; i < calendar.length; i++) {
        var shift = calendar[i];

        if (shift.dayName === 'Saturday' || shift.dayName === 'Sunday' ||
            (shift.dayName === 'Friday' && shift.shiftName === 'L&D Night')) {
            weekendShifts.push(shift);
        } else {
            weekdayShifts.push(shift);
        }
    }
    assignShifts(weekendShifts, employeeArray, 'weekend');
    assignShifts(weekdayShifts, employeeArray, 'weekday');

    console.log(calendar.length);
}

function assignShifts(shifts, employeeArray, shiftType) {
    var shiftIDs = _.pluck(shifts, 'shiftID'),
        getEmployee = (shiftType === 'weekend') ? getWeekendEmployee : getWeekdayEmployee,
        targetWeek = 0,
        emp;


    //for each shift to assign
    for (var i = 0; i < shifts.length; i++) {
        var shift = shifts[i];
        //if the shift is unassigned
        if (_.isEmpty(shifts[i].shiftAssignee)) {
            //check whether this is a new week
            if (targetWeek !== shift.weekNumber && shiftType === 'weekday') {
                //start new week processes
                targetWeek = shift.weekNumber;
                console.log(targetWeek);
                adjustEmployeeRecordsForWeek(employeeArray, targetWeek);
            }

            emp = getEmployee(employeeArray, shiftIDs, shift.shiftID);
            CalendarActions.setSelectedShift(shift.shiftID);
            EmployeeActions.setAssignedEmployee(emp.employeeID);

            if (shiftType === 'weekday') {
                updateThisWeeksShifts(emp, targetWeek);
                setNewRatio(emp);
                sortEmployeeArrayByRatio(employeeArray);
            }
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

    var employeeInArray = 0,
        candidate, randomEmployee;

    while (!randomEmployee) { //TODO: This is not an aptly named variable
        candidate = employeeArray[employeeInArray];

        //Does the candidate have any conflicts?
        if (employeeHasConflict(candidate, targetShift)) {
            employeeInArray++;
        } else {
            randomEmployee = candidate;
        }
    }

    return randomEmployee;
}

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

function employeeHasConflict(candidate, targetShift) {
    var shiftID = targetShift,
        shifts = candidate.assignedShifts,
        dayOfShift = shiftID.split('-')[0],
        dayAfter = moment(dayOfShift, 'DDMMMMYYYY').add(1, 'days').format('DDMMMMYYYY'),
        dayBefore = moment(dayOfShift, 'DDMMMMYYYY').subtract(1, 'days').format('DDMMMMYYYY'),
        dayBeforeRegex = new RegExp('(' + dayBefore + ')[-\\d]+(-LN)'),
        dayAfterRegex = new RegExp('(' + dayAfter + ')[-\\d]+(-LN)'),
        shiftsArrayString = shifts.toString(),
        hasConflicts = false,

        hasShiftOnSameDay = shiftsArrayString.match(dayOfShift),
        hasShiftOnNextDay = shiftsArrayString.match(dayAfter) &&
            dayAfterRegex.exec(shiftsArrayString) === null,
        hasNightShiftOnPreviousDay = dayBeforeRegex.exec(shiftsArrayString),
        selectedShiftIsNightShift = _.includes(shiftID, '-LN');

    //Conflict on Same Day
    //employee has another shift scheduled on the same day
    if (hasShiftOnSameDay) {
        return true;
    }

    //Conflict on Next Day
    //selected shift IS a Night Shift
    //and the employee has a shift scheduled on the next day that IS NOT a Night Shift
    if (selectedShiftIsNightShift && hasShiftOnNextDay) {
        return true;
    }

    //Conflict on Previous Day
    //selected shift IS NOT a Night Shift
    //and the employee has a shift scheduled on the previous day that IS a Night Shift
    if (!selectedShiftIsNightShift && hasNightShiftOnPreviousDay) {
        return true;
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

/**
 * For each employee record in employeeArray, set the value of the updateThisWeeksShifts
 * to an empty array, then call updateThisWeeksShifts to repopulate that array,
 * then sort the employeeArray by each employee's assigned/contracted ratio
 * @param employeeArray
 * @param targetWeek
 */
function adjustEmployeeRecordsForWeek(employeeArray, targetWeek) {
    for (var i = 0; i < employeeArray.length; i++) {
        var employee = employeeArray[i],
            totalHours;
        employee.thisWeeksShifts = [];
        updateThisWeeksShifts(employee, targetWeek);
        setNewRatio(employee);
    }
    sortEmployeeArrayByRatio(employeeArray);
}

function updateThisWeeksShifts(employee, targetWeek) {
    var assignedShifts = employee.assignedShifts,
        thisWeeksShifts = employee.thisWeeksShifts;

    for (var i = 0; i < assignedShifts.length; i++) {
        var assignedShift = assignedShifts[i],
            shiftWeek = Number.parseInt(assignedShift.split('-')[1], 10);
        if (targetWeek === shiftWeek) {
            thisWeeksShifts.push(assignedShift);
        }
    }
}

function setNewRatio(employee) {
    var weeksShiftsArray = (employee.hasOwnProperty('thisWeeksShifts')) ? employee.thisWeeksShifts : [],
        contractedHoursForWeek = employee.contractedHours,
        assignedHoursForWeek = 0;

    for (var i = 0; i < weeksShiftsArray.length; i++) {
        var shiftLength = Number.parseInt(weeksShiftsArray[i].split('-')[2], 10);
        assignedHoursForWeek += shiftLength;
    }

    employee.shiftRatio = assignedHoursForWeek / contractedHoursForWeek;
}

function sortEmployeeArrayByRatio(employeeArray) {
    employeeArray.sort(function(a, b) {
        return a.shiftRatio - b.shiftRatio;
    });
    //console.log(employeeArray);
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
