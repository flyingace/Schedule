/* Created by davidcameron on 6/7/15. */

/*globals */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CalendarConstants = require('../constants/CalendarConstants');
var _ = require('underscore');

// Define initial data points
var _product = {}, _selected = null;

// Show Employee Menu
function showEmployeeMenu(data) {
    _product = data[0];
    _selected = data[0].variants[0];
}

// Hide Employee Menu
function hideEmployeeMenu(index) {
    _selected = _product.variants[index];
}


// Method to load product data from mock API
function assignShift(data) {
    _product = data[0];
    _selected = data[0].variants[0];
}

// Method to set the currently selected product variation
function unassignShift(index) {
    _selected = _product.variants[index];
}


// Extend CalendarStore with EventEmitter to add eventing capabilities
var CalendarStore = _.extend({}, EventEmitter.prototype, {

    // Return Product data
    getProduct: function() {
        return _product;
    },

    // Return selected Product
    getSelected: function(){
        return _selected;
    },

    // Emit Change event
    emitChange: function() {
        this.emit('change');
    },

    // Add change listener
    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    // Remove change listener
    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }

});

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
    var action = payload.action;
    var text;

    switch(action.actionType) {

        case CalendarConstants.SHOW_EMPLOYEE_MENU:
            showEmployeeMenu();
            break;

        case CalendarConstants.HIDE_EMPLOYEE_MENU:
            hideEmployeeMenu();
            break;

        // Respond to RECEIVE_DATA action
        case CalendarConstants.SHIFT_ASSIGN:
            assignShift(action.data);
            break;

        // Respond to SELECT_PRODUCT action
        case CalendarConstants.SHIFT_UNASSIGN:
            unassignShift(action.data);
            break;

        default:
            return true;
    }

    // If action was responded to, emit change event
    CalendarStore.emitChange();

    return true;

});

module.exports = CalendarStore;