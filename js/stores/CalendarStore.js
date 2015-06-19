/* Created by davidcameron on 6/7/15. */

/*globals */

var $ = require('jquery');
var _ = require('lodash');
var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');
var EventEmitter = require('events').EventEmitter;

// Define initial data points
var _calendarData = {}, _selectedShift, _employee = '';

function loadCalendarData(data) {
    _calendarData = data;
}

function setSelectedShift(shiftID) {
    var _days, _shifts, _selectedShift, i, j, k;

    for (i = 0; i < _calendarData.length; i++) {
        _days = _calendarData[i].Days;
        for (j = 0; j < _days.length; j++) {
            _shifts = _days[j].Shifts;
            for (k = 0; k < _shifts.length; k++) {
                if (_shifts[k].shiftID === shiftID) {
                    _shifts[k].selected = true;

                    _selectedShift = _shifts[k]
                    console.log(_shifts[k]);
                    return;
                }
            }
        }
    }
}

//Instead of selecting the shift by ID and modifying it in the data, get the selected shift itself and then locate that shift object in the array of shift objects.

/*
 var arr = [{thing1:'one'}, {thing1:'two'}, {thing1:'three'}, {thing1:'four'}, {thing1:'five'}, {thing1:'six'}, {thing1:'seven'}];
 var up = arr [2];
 up.thing1 = 'twelve';
 console.log(arr[arr.indexOf(up)].thing1); //twelve
*/

    /*
     Shift would be clicked, and the controller would be notified
     The controller would notify the calendar model with the id of this "selected" shift
     The controller would notify the employee model to update the visibility of the employee menu
     The calendar model would announce a change, the view would retrieve the id of the newly selected shift and
     adjust the view
     The employee model would announce a change and the view would retrieve the updated visibility of the menu and
     display the menu
     An employee name would be clicked
     */

//TODO: Not sure if this is nec. for our purposes since
// employee assignment is only used for display at the moment
// and the only way to change this display would be to set a shift's
// assignment to "Unassigned."
function unassignEmployeeToShift(employee) {
    _employee = employee;
}

// Extend CalendarStore with EventEmitter to add eventing capabilities
var CalendarStore = _.extend({}, EventEmitter.prototype, {

    // Return Product data
    getCalendarData: function () {
        return _calendarData;
    },

    // Return selected Shift
    getSelectedShift: function () {
        return _selectedShift;
    },

    assignEmployeeToShift: function (employee) {
        var _days, _shifts, i, j, k;

        for (i = 0; i < _calendarData.length; i++) {
            _days = _calendarData[i].Days;
            for (j = 0; j < _days.length; j++) {
                _shifts = _days[j].Shifts;
                for (k = 0; k < _shifts.length; k++) {
                    if (_shifts[k].selected === true) {
                        _shifts[k].selected = false;
                        _shifts[k].shiftAssignee = employee;
                        return;
                    }
                }
            }
        }
    },

    getAssignedEmployee: function () {
        return _employee;
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

        // Respond to RECEIVE_CALENDAR_DATA action
        case ScheduleConstants.RECEIVE_CALENDAR_DATA:
            loadCalendarData(action.data);
            break;

        case ScheduleConstants.UPDATE_SHIFT_SELECTION:
            setSelectedShiftID(action.shiftID);
            break;

        // Respond to SHIFT_ASSIGN action
        //case ScheduleConstants.UPDATE_EMPLOYEE_SELECTION:
        //    assignEmployeeToShift(action.employeeName);
        //    break;

        // Respond to SHIFT_UNASSIGN action
        case ScheduleConstants.SHIFT_UNASSIGN:
            unassignEmployeeToShift(action.data);
            break;

        default:
            return true;
    }

    // If action was responded to, emit change event
    CalendarStore.emitChange();

    return true;

}
);

module.exports = CalendarStore;
