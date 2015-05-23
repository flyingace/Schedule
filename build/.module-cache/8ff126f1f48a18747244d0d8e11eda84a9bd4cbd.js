/* Created by davidcameron on 5/21/15. */

/*globals */

/** @jsx React.DOM */

var Day = React.createClass({displayName: "Day",
    render: function () {
        return (
            React.createElement("div", {className: "day"}, 
                React.createElement("h2", null, this.props.dayName), 
                React.createElement(Shift, {shiftName: this.props.shiftName})
            )
        );
    }
});