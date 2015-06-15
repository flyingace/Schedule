/* Created by davidcameron on 6/7/15. */

/*globals */

var keyMirror = require('react/lib/keyMirror');

// Define action constants
module.exports = keyMirror({
    RECEIVE_CALENDAR_DATA: null,        // Receive Calendar Data from localstorage
    RECEIVE_EMPLOYEE_DATA: null,        // Receive Employee Data from localstorage
    UPDATE_SHIFT_SELECTION: null,       // Update selection of currently selected Shift
    UPDATE_LIST_VISIBILITY: null,       // Toggle visibility of list of available employees
    UPDATE_EMPLOYEE_ASSIGNMENT: null,     // Assign Employee to Shift
    SHIFT_ASSIGN: null,                 // Assign Shift to Employee
    SHIFT_UNASSIGN: null                // Unassign Shift from Employee
});
