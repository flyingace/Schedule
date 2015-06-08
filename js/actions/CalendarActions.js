/* Created by davidcameron on 6/7/15. */

/*globals */

var Dispatcher = require('../dispatcher/Dispatcher');
var CalendarConstants = require('../constants/CalendarConstants');

// Define actions object
var CalendarActions = {

    //// Receive inital product data
    //receiveProduct: function (data) {
    //    Dispatcher.handleAction({
    //        actionType: CalendarConstants.RECEIVE_DATA,
    //        data: data
    //    });
    //},

    // Assign Shift to Employee
    assignShift: function (sku, update) {
        Dispatcher.handleAction({
            actionType: CalendarConstants.SHIFT_ASSIGN,
            sku: sku,
            update: update
        });
    },

    // Unassign Shift from Employee
    unassignShift: function (sku) {
        Dispatcher.handleAction({
            actionType: CalendarConstants.SHIFT_UNASSIGN,
            sku: sku
        });
    }
};

module.exports = CalendarActions;