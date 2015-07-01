/* Created by davidcameron on 6/7/15. */

/*globals */

var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');

// Define actions object
var EmployeeActions = {

    // Receive inital schedule data
    receiveEmployeeData: function (data) {
        ScheduleDispatcher.handleAction({
            actionType: ScheduleConstants.RECEIVE_EMPLOYEE_DATA,
            data: data
        });
    },

    // Assign Shift to Employee
    setAssignedEmployee: function (employeeID) {
        ScheduleDispatcher.handleAction({
            actionType: ScheduleConstants.UPDATE_EMPLOYEE_SELECTION,
            employeeID: employeeID
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

    // Show & Position Employee List
    updateListStatus: function (empListIsVisible, targetShift) {
        ScheduleDispatcher.handleAction({
            actionType: ScheduleConstants.UPDATE_LIST_VISIBILITY,
            empListIsVisible: empListIsVisible,
            targetShift: targetShift
        });
    },

    // Update availability for selected shift
    updateAvailability: function (shiftID) {
        ScheduleDispatcher.handleAction({
            actionType: ScheduleConstants.UPDATE_EMPLOYEE_AVAILABILITY,
            shiftID: shiftID
        });
    }
};

module.exports = EmployeeActions;
