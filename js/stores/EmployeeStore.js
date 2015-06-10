/* Created by davidcameron on 6/7/15. */

/*globals */

var CalendarDispatcher = require('../dispatcher/CalendarDispatcher');
var EventEmitter = require('events').EventEmitter;
var CalendarConstants = require('../constants/CalendarConstants');
var _ = require('underscore');

// Define initial data points
var _employees = {}, _empListVisible = false;

// Add product to cart
function add(sku, update) {
    update.quantity = sku in _employees ? _employees[sku].quantity + 1 : 1;
    _employees[sku] = _.extend({}, _employees[sku], update);
}

// Set cart visibility
function setEmpListVisible(empListVisible) {
    _empListVisible = empListVisible;
}

// Remove item from cart
function removeItem(sku) {
    delete _employees[sku];
}

// Extend Cart Store with EventEmitter to add eventing capabilities
var EmployeeStore = _.extend({}, EventEmitter.prototype, {

    // Return cart items
    getCartItems: function() {
        return _employees;
    },

    // Return # of items in cart
    getCartCount: function() {
        return Object.keys(_employees).length;
    },

    // Return cart cost total
    getCartTotal: function() {
        var total = 0;
        for (var product in _employees){
            if (_employees.hasOwnProperty(product)) {
                total += _employees[product].price * _employees[product].quantity;
            }
        }
        return total.toFixed(2);
    },

    // Return cart visibility state
    getEmpListVisible: function() {
        return _empListVisible;
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

// Register callback with CalendarDispatcher
CalendarDispatcher.register(function(payload) {
    var action = payload.action;
    var text;

    switch(action.actionType) {

        // Respond to CART_ADD action
        case CalendarConstants.SHIFT_ASSIGN:
            add(action.sku, action.update);
            break;

        // Respond to SHOW_EMPLOYEE_LIST action
        case CalendarConstants.UPDATE_LIST_VISIBILITY:
            setEmpListVisible(action.empListVisible);
            break;

        // Respond to CART_REMOVE action
        case CalendarConstants.SHIFT_UNASSIGN:
            removeItem(action.sku);
            break;

        default:
            return true;
    }

    // If action was responded to, emit change event
    EmployeeStore.emitChange();

    return true;

});

module.exports = EmployeeStore;