/* Created by davidcameron on 5/21/15. */

/*globals */

/** @jsx React.DOM */

var Shift = React.createClass({
    render: function () {
        return (
            <div className = "shift"><p>{this.props.shiftName}</p></div>
        );
    }
});