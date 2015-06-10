/* Created by davidcameron on 6/7/15. */

/*globals */

var keyMirror = require('react/lib/keyMirror');

// Define action constants
module.exports = keyMirror({
    RECEIVE_DATA: null,             // Receive Schedule Data from localstorage
    SHIFT_SELECT: null,             // Select a Shift in the Calendar
    SHIFT_DESELECT: null,           // Deselect a Shift in the Calendar
    UPDATE_LIST_VISIBILITY: null,   // Show the menu of available employees
    HIDE_EMPLOYEE_LIST: null,       // Hide the menu of available employees
    SHIFT_ASSIGN: null,             // Assign Shift to Employee
    SHIFT_UNASSIGN: null            // Unassign Shift from Employee
});
