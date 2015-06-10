/* Created by davidcameron on 6/7/15. */

/*globals */

var CalendarDispatcher = require('../dispatcher/CalendarDispatcher');
var CalendarConstants = require('../constants/CalendarConstants');

// Define actions object
var CalendarActions = {

    Receive inital schedule data
    receiveSchedule: function (data) {
        CalendarDispatcher.handleAction({
            actionType: CalendarConstants.RECEIVE_DATA,
            data: data
        });
    },

    // Assign Shift to Employee
    assignShift: function (sku, update) {
        CalendarDispatcher.handleAction({
            actionType: CalendarConstants.SHIFT_ASSIGN,
            sku: sku,
            update: update
        });
    },

    // Unassign Shift from Employee
    unassignShift: function (sku) {
        CalendarDispatcher.handleAction({
            actionType: CalendarConstants.SHIFT_UNASSIGN,
            sku: sku
        });
    },

    // Show Employee List
    updateListVisibility: function (empListVisible) {
        CalendarDispatcher.handleAction({
            actionType: CalendarConstants.UPDATE_LIST_VISIBILITY,
            empListVisible: empListVisible
        });
    },

    // Show Employee List
    hideEmployeeList: function () {
        CalendarDispatcher.handleAction({
            actionType: CalendarConstants.HIDE_EMPLOYEE_LIST
        });
    }
};

module.exports = CalendarActions;