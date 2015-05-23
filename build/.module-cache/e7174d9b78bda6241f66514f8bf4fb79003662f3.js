/* Created by davidcameron on 5/21/15. */

/*globals */

var Month = React.createClass({displayName: "Month",
    render: function () {
        return (
            React.createElement("div", {className: "month"}, 
                React.createElement("h1", null, this.props.monthName), 
                React.createElement(Day, {dayName: this.props.dayName})
            )
        );
    }
});
