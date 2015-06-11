/* Created by davidcameron on 6/7/15. */

/*globals */

var ScheduleDispatcher = require('../dispatcher/ScheduleDispatcher');
var ScheduleConstants = require('../constants/ScheduleConstants');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

// Define initial data points
var _employeeData = {}, _empListVisible = false;

function loadEmployeeData(data) {
    _employeeData = data;
}

function assignShiftToEmployee(data) {
    _product = data[0];
    _selected = data[0].variants[0];
}

function unassignShiftToEmployee(index) {
    _selected = _product.variants[index];
}

// Set cart visibility
function setEmpListVisible(empListVisible) {
    _empListVisible = empListVisible;
}

// Extend Cart Store with EventEmitter to add eventing capabilities
var EmployeeStore = _.extend({}, EventEmitter.prototype, {

    getEmployeeData: function () {
        return _employeeData;
    },

    // Return cart visibility state
    getEmpListVisible: function () {
        return _empListVisible;
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

});

// Register callback with ScheduleDispatcher
ScheduleDispatcher.register(function (payload) {
    var action = payload.action,
        text;

    switch (action.actionType) {

        // Respond to RECEIVE_DATA action
        case ScheduleConstants.RECEIVE_EMPLOYEE_DATA:
            loadEmployeeData(action.data);
            break;

        // Respond to SHIFT_ASSIGN action
        case ScheduleConstants.SHIFT_ASSIGN:
            assignShiftToEmployee(action.data);
            break;

        // Respond to SHIFT_UNASSIGN action
        case ScheduleConstants.SHIFT_UNASSIGN:
            unassignShiftToEmployee(action.data);
            break;

        // Respond to UPDATE_LIST_VISIBILITY action
        case ScheduleConstants.UPDATE_LIST_VISIBILITY:
            setEmpListVisible(action.empListVisible);
            break;

        default:
            return true;
    }

    // If action was responded to, emit change event
    EmployeeStore.emitChange();

    return true;

});

module.exports = EmployeeStore;