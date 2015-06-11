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

    // Assign Shift to Employee
    assignShift: function (sku, update) {
        ScheduleDispatcher.handleAction({
            actionType: ScheduleConstants.SHIFT_ASSIGN,
            sku: sku,
            update: update
        });
    },

    // Unassign Shift from Employee
    unassignShift: function (sku) {
        ScheduleDispatcher.handleAction({
            actionType: ScheduleConstants.SHIFT_UNASSIGN,
            sku: sku
        });
    },

    // Show Employee List
    updateListVisibility: function (empListVisible) {
        ScheduleDispatcher.handleAction({
            actionType: ScheduleConstants.UPDATE_LIST_VISIBILITY,
            empListVisible: empListVisible
        });
    },

    // Show Employee List
    hideEmployeeList: function () {
        ScheduleDispatcher.handleAction({
            actionType: ScheduleConstants.HIDE_EMPLOYEE_LIST
        });
    }
};

module.exports = CalendarActions;