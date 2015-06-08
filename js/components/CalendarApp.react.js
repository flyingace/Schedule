/* Created by davidcameron on 6/7/15. */

/*globals */

var React = require('react');
var CalendarStore = require('../stores/CalendarStore');
var EmployeeStore = require('../stores/EmployeeStore');
var Calendar = require('./Calendar.react');
var EmployeeList = require('./EmployeeList.react');

// Method to retrieve state from Stores
function getCalendarState() {
    return {
        product: EmployeeStore.getProduct(),
        selectedProduct: EmployeeStore.getSelected(),
        cartItems: CalendarStore.getCartItems(),
        cartCount: CalendarStore.getCartCount(),
        cartTotal: CalendarStore.getCartTotal(),
        cartVisible: CalendarStore.getCartVisible()
    };
}

// Define main Controller View
var CalendarApp = React.createClass({

    // Get initial state from stores
    getInitialState: function() {
        return getCalendarState();
    },

    // Add change listeners to stores
    componentDidMount: function() {
        EmployeeStore.addChangeListener(this._onChange);
        CalendarStore.addChangeListener(this._onChange);
    },

    // Remove change listers from stores
    componentWillUnmount: function() {
        EmployeeStore.removeChangeListener(this._onChange);
        CalendarStore.removeChangeListener(this._onChange);
    },

    // Render our child components, passing state via props
    render: function() {
        return (
            <div className="flux-cart-app">
                <Calendar products={this.state.cartItems} count={this.state.cartCount} total={this.state.cartTotal} visible={this.state.cartVisible} />
            </div>
        );
    },

    // Method to setState based upon Store changes
    _onChange: function() {
        this.setState(getCalendarState());
    }

});

module.exports = CalendarApp;