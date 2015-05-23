/* Created by davidcameron on 5/21/15. */

/*globals */

/** @jsx React.DOM */

var Month = React.createClass({displayName: "Month",
    render: function () {
        return (
            React.createElement("div", {className: "month"}, 
                React.createElement("h1", null, this.props.monthName)
            )
        );
    }
});
