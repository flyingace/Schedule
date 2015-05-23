/* Created by davidcameron on 5/21/15. */

/*globals */

var Month = React.createClass({displayName: "Month",
    render: function () {
        return (
            React.createElement("div", {className: "month"}, this.props.month-name)
        );
    }
});
