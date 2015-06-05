/* Created by davidcameron on 5/21/15. */

/*globals */

/** @jsx React.DOM */

var Day = React.createClass({displayName: "Day",
    getDefaultProps: function () {
        return {dayName: "Saturday"};
    },

    render: function () {
        var dayClass = "day " + this.props.dayName.toLowerCase();

        return (
            React.createElement("div", {className: dayClass}, 
                React.createElement("h2", null, this.props.dayName, " ", this.props.dayDate), 
                
                    this.props.shifts.map(function (shiftSet, index) {
                        if (shiftSet.required) {
                            return (
                                React.createElement(Shift, {shiftName: shiftSet.shiftName, key: index})
                            )
                        }
                    })
                
            )
        );
    }
});