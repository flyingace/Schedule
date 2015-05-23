/* Created by davidcameron on 5/21/15. */

/*globals */

/** @jsx React.DOM */

var Day = React.createClass({displayName: "Day",
    getInitialState: function () {
        return {dayName: "Saturday"};

    },

    render: function () {
        return (
            React.createElement("div", {className: "day"}, 
                React.createElement("h2", null, this.props.dayName)
            )
        );
    }
});