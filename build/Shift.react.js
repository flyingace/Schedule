/* Created by davidcameron on 5/21/15. */

/*globals */

/** @jsx React.DOM */

var Shift = React.createClass({displayName: "Shift",
    render: function () {
        return (
            React.createElement("div", {className: "shift"}, React.createElement("p", null, this.props.shiftName))
        );
    }
});