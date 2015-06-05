/* Created by davidcameron on 5/21/15. */

/*globals */

/** @jsx React.DOM */

var Day = React.createClass({
    getDefaultProps: function () {
        return {dayName: "Saturday"};
    },

    render: function () {
        var dayClass = "day " + this.props.dayName.toLowerCase();

        return (
            <div className = {dayClass}>
                <h2>{this.props.dayName} {this.props.dayDate}</h2>
                {
                    this.props.shifts.map(function (shiftSet, index) {
                        if (shiftSet.required) {
                            return (
                                <Shift shiftName = {shiftSet.shiftName} key = {index}/>
                            )
                        }
                    })
                }
            </div>
        );
    }
});