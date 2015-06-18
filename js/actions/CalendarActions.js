/* Created by davidcameron on 6/7/15. */

/*globals */

var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');

// Define actions object
var CalendarActions = {

    // Receive inital schedule data
    receiveCalendarData: function (data) {
        ScheduleDispatcher.handleAction({
            actionType: ScheduleConstants.RECEIVE_CALENDAR_DATA,
            data: data
        });
    },

    //Set Clicked Shift as Selected Shift
    setSelectedShift: function (shiftID) {
        ScheduleDispatcher.handleAction({
            actionType: ScheduleConstants.UPDATE_SHIFT_SELECTION,
            shiftID: shiftID
        });
    },

    // Assign Shift to Employee
    assignEmployee: function (assignedEmployee) {
        ScheduleDispatcher.handleAction({
            actionType: ScheduleConstants.UPDATE_EMPLOYEE_ASSIGNMENT,
            assignee: assignedEmployee
        });
    },

    // Show Employee List
    updateListVisibility: function (empListVisible) {
        ScheduleDispatcher.handleAction({
            actionType: ScheduleConstants.UPDATE_LIST_VISIBILITY,
            empListVisible: empListVisible
        });
    }
};

module.exports = CalendarActions;